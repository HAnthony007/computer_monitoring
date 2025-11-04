// Top-level module declarations
mod domain;
mod cli;
mod utils;
mod features;
mod api;

use clap::Parser;
use crate::cli::{Cli, Commands};
use crate::domain::AgentError;
use reqwest::Client;
use std::time::Duration;
use sysinfo::{Disks, Networks, System};

#[tokio::main]
async fn main() -> Result<(), AgentError> {
    // Load .env if present
    let _ = dotenvy::dotenv();

    let cli = Cli::parse();

    match cli.command.unwrap_or(Commands::Run { api_key: None, api_key_file: None, interval_secs: 2, heartbeat_secs: 5, dry_run: false }) {
        Commands::Register { hostname, ip_address, os, agent_version: agent_version_opt } => {
            let host = hostname.unwrap_or_else(|| utils::detect_hostname());
            let ip = ip_address.unwrap_or_else(|| utils::detect_ip());
            let os_str = os.unwrap_or_else(|| utils::detect_os_string());
            let version = agent_version_opt.unwrap_or_else(|| utils::agent_version());

            let client = Client::builder()
                .timeout(Duration::from_secs(5))
                .build()
                .unwrap();

            let url = format!("{}/api/agent/register", cli.server_url.trim_end_matches('/'));
            let body = serde_json::json!({
                "hostname": host,
                "ipAddress": ip,
                "os": os_str,
                "agentVersion": version,
            });
            let res = client.post(url).json(&body).send().await?;
            let status = res.status();
            let text = res.text().await?;
            if !status.is_success() {
                eprintln!("register failed: {}\n{}", status, text);
                std::process::exit(1);
            }
            let v: serde_json::Value = serde_json::from_str(&text).unwrap_or(serde_json::json!({"raw": text}));
            let api_key = v.get("apiKey").and_then(|x| x.as_str()).unwrap_or("");
            println!("Registration successful. API key:\n{}", api_key);
            println!("\nUsage (fish):\nset -x API_KEY {}\n./target/release/cm-agent run --server-url {}", api_key, cli.server_url);
            Ok(())
        }
        Commands::Run { api_key, api_key_file, interval_secs, heartbeat_secs, dry_run } => {

            let client = Client::builder()
                .timeout(Duration::from_secs(5))
                .build()
                .unwrap();

            // Resolve API key or auto-register + persist if missing
            let api_key = api::resolve_or_register_api_key(&client, &cli.server_url, api_key, api_key_file).await?;

            // Spawn heartbeat loop
            let client_hb = client.clone();
            let base = cli.server_url.clone();
            let api_key_hb = api_key.clone();
            let hb_version = utils::agent_version();
            tokio::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_secs(heartbeat_secs));
                loop {
                    interval.tick().await;
                    let _ = api::send_heartbeat(&client_hb, &base, &api_key_hb, &hb_version).await;
                    if let Ok(cmds) = api::poll_commands(&client_hb, &base, &api_key_hb).await {
                        for cmd in cmds {
                            if cmd.command_type == "KILL_PROCESS" {
                                if let Some(pid) = cmd.pid {
                                    match crate::features::process::kill_process(pid) {
                                        Ok(_) => eprintln!("[cm-agent] killed pid {}", pid),
                                        Err(e) => eprintln!("[cm-agent] failed to kill pid {}: {}", pid, e),
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // Metrics loop
            let mut sys = System::new();
            let mut disks = Disks::new();
            let mut nets = Networks::new();

            loop {
                let batch = features::collect_batch(&mut sys, &mut disks, &mut nets).await;
                // Optional debug: set CM_DEBUG=1 to print collected summaries each tick
                if std::env::var("CM_DEBUG").ok().as_deref() == Some("1") {
                    if let Some(c) = batch.cpu.get(0) {
                        let per_core_len = c.per_core_usage.as_ref().map(|v| v.len()).unwrap_or(0);
                        eprintln!(
                            "[cm-agent][debug] cpu: usage={:.1}% model={:?} cores={:?} per_core_len={} temp={:?}",
                            c.usage_percent, c.model_name, c.core_count, per_core_len, c.temperature
                        );
                    }
                    eprintln!("[cm-agent][debug] processes: {}", batch.processes.len());
                    let mut top = batch.processes.clone();
                    top.sort_by(|a, b| b
                        .cpu_percent
                        .partial_cmp(&a.cpu_percent)
                        .unwrap_or(std::cmp::Ordering::Equal));
                    for p in top.into_iter().take(3) {
                        eprintln!(
                            "[cm-agent][debug] pid={} cpu={:?} mem={:?} {}",
                            p.pid, p.cpu_percent, p.memory_bytes, p.program
                        );
                    }
                }
                if dry_run {
                    println!("{}", serde_json::to_string_pretty(&batch).unwrap());
                } else {
                    match api::send_batch(&client, &cli.server_url, &api_key, &batch).await {
                        Ok(_) => {
                            println!("[cm-agent] sent metrics: cpu={} mem={} disks={} nets={}", batch.cpu.len(), batch.memory.len(), batch.disks.len(), batch.network.len());
                        }
                        Err(e) => {
                            eprintln!("[cm-agent] send error: {}", e);
                        }
                    }
                }
                tokio::time::sleep(Duration::from_secs(interval_secs)).await;
            }
        }
    }
}
