use clap::{ArgAction, Parser, Subcommand};
use chrono::{SecondsFormat, Utc};
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use serde::Serialize;
use std::time::Duration;
use sysinfo::{Disks, Networks, System};
use thiserror::Error;
use dotenvy::dotenv;
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use hostname::get as get_hostname_os;

#[derive(Debug, Error)]
enum AgentError {
    #[error("missing API key (use --api-key or set API_KEY)")]
    MissingApiKey,
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Http(#[from] reqwest::Error),
    #[error(transparent)]
    Json(#[from] serde_json::Error),
}

#[derive(Parser, Debug, Clone)]
#[command(name = "cm-agent", version, about = "Computer Monitoring Rust Agent")]
struct Cli {
    /// Server base URL (without trailing slash)
    #[arg(long, env = "SERVER_URL", global = true, default_value = "http://localhost:8080")]
    server_url: String,

    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand, Debug, Clone)]
enum Commands {
    /// Run the agent loop (collect + send)
    Run {
        /// API Key in form: <agentId>.<secret>
        #[arg(long, env = "API_KEY")]
        api_key: Option<String>,

        /// Path to a file containing the API key
        #[arg(long, env = "API_KEY_FILE")]
        api_key_file: Option<PathBuf>,

        /// Metrics send interval in seconds
        #[arg(long, env = "INTERVAL_SECS", default_value_t = 10)]
        interval_secs: u64,

        /// Heartbeat interval in seconds
        #[arg(long, env = "HEARTBEAT_SECS", default_value_t = 30)]
        heartbeat_secs: u64,

        /// Print payloads to stdout
        #[arg(long, action = ArgAction::SetTrue)]
        dry_run: bool,
    },

    /// Register this machine to obtain an API key
    Register {
        /// Explicit hostname (auto if omitted)
        #[arg(long, env = "HOSTNAME")]
        hostname: Option<String>,

        /// Explicit IP address (auto if omitted)
        #[arg(long, env = "IP_ADDRESS")]
        ip_address: Option<String>,

        /// OS description (auto if omitted)
        #[arg(long, env = "AGENT_OS")]
        os: Option<String>,

        /// Agent version override
        #[arg(long, env = "AGENT_VERSION")]
        agent_version: Option<String>,
    },
}

#[derive(Serialize, Debug, Clone)]
struct CpuPoint {
    #[serde(rename = "usagePercent")] 
    usage_percent: f64,
    #[serde(rename = "cpuName", skip_serializing_if = "Option::is_none")]
    cpu_name: Option<String>,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
struct MemoryPoint {
    #[serde(rename = "totalMb")] 
    total_mb: u64,
    #[serde(rename = "usedMb")] 
    used_mb: u64,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
struct DiskPoint {
    #[serde(rename = "mountPoint")] 
    mount_point: String,
    #[serde(rename = "totalGb")] 
    total_gb: f64,
    #[serde(rename = "usedGb")] 
    used_gb: f64,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
struct NetworkPoint {
    #[serde(rename = "interface")] 
    interface: String,
    #[serde(rename = "rxBytes")] 
    rx_bytes: u64,
    #[serde(rename = "txBytes")] 
    tx_bytes: u64,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone, Default)]
struct BatchPayload {
    cpu: Vec<CpuPoint>,
    memory: Vec<MemoryPoint>,
    disks: Vec<DiskPoint>,
    network: Vec<NetworkPoint>,
}

fn now_iso() -> String {
    Utc::now().to_rfc3339_opts(SecondsFormat::Secs, true)
}

fn to_mb(bytes: u64) -> u64 { bytes / 1024 / 1024 }
fn bytes_to_gb_f(bytes: u64) -> f64 { (bytes as f64) / 1024.0 / 1024.0 / 1024.0 }

async fn collect_batch(sys: &mut System, disks: &mut Disks, nets: &mut Networks) -> BatchPayload {
    // Refresh CPU twice to get a meaningful usage percentage
    sys.refresh_cpu_all();
    tokio::time::sleep(Duration::from_millis(500)).await;
    sys.refresh_cpu_all();

    let recorded_at = Some(now_iso());

    // CPU
    let cpu_usage = sys.global_cpu_usage() as f64;
    let cpu = vec![CpuPoint { usage_percent: cpu_usage, cpu_name: Some("cpu".into()), recorded_at: recorded_at.clone() }];

    // Memory
    sys.refresh_memory();
    let total_mem = sys.total_memory();
    let used_mem = sys.used_memory();
    let memory = vec![MemoryPoint { total_mb: to_mb(total_mem), used_mb: to_mb(used_mem), recorded_at: recorded_at.clone() }];

    // Disks
    disks.refresh(true);
    let mut disks_vec = Vec::new();
    for d in disks.list() {
        let mp = d.mount_point().to_string_lossy().to_string();
        let total = d.total_space();
        let available = d.available_space();
        let used = total.saturating_sub(available);
        disks_vec.push(DiskPoint { mount_point: mp, total_gb: bytes_to_gb_f(total), used_gb: bytes_to_gb_f(used), recorded_at: recorded_at.clone() });
    }

    // Network
    nets.refresh(true);
    let mut network_vec = Vec::new();
    for (name, data) in nets.iter() {
        network_vec.push(NetworkPoint {
            interface: name.to_string(),
            rx_bytes: data.total_received(),
            tx_bytes: data.total_transmitted(),
            recorded_at: recorded_at.clone(),
        });
    }

    BatchPayload { cpu, memory, disks: disks_vec, network: network_vec }
}

async fn send_batch(client: &reqwest::Client, base_url: &str, api_key: &str, payload: &BatchPayload) -> Result<(), AgentError> {
    let url = format!("{}/api/metrics/batch", base_url.trim_end_matches('/'));
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert("X-API-Key", HeaderValue::from_str(api_key).unwrap_or_else(|_| HeaderValue::from_static("invalid")));

    client
        .post(url)
        .headers(headers)
        .json(payload)
        .send()
        .await?
        .error_for_status()?;
    Ok(())
}

#[tokio::main]
async fn main() -> Result<(), AgentError> {
    // Load .env if present
    let _ = dotenv();
    let cli = Cli::parse();

    match cli.command.unwrap_or(Commands::Run { api_key: None, api_key_file: None, interval_secs: 10, heartbeat_secs: 30, dry_run: false }) {
        Commands::Register { hostname, ip_address, os, agent_version: agent_version_opt } => {
            let host = hostname.unwrap_or_else(detect_hostname);
            let ip = ip_address.unwrap_or_else(detect_ip);
            let os_str = os.unwrap_or_else(detect_os_string);
            let version = agent_version_opt.unwrap_or_else(|| agent_version());

            let client = reqwest::Client::builder()
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

            let client = reqwest::Client::builder()
                .timeout(Duration::from_secs(5))
                .build()
                .unwrap();

            // Resolve API key or auto-register + persist if missing
            let api_key = resolve_or_register_api_key(&client, &cli.server_url, api_key, api_key_file).await?;

            // Spawn heartbeat loop
            let client_hb = client.clone();
            let base = cli.server_url.clone();
            let api_key_hb = api_key.clone();
            let hb_version = agent_version();
            tokio::spawn(async move {
                let mut interval = tokio::time::interval(Duration::from_secs(heartbeat_secs));
                loop {
                    interval.tick().await;
                    let _ = send_heartbeat(&client_hb, &base, &api_key_hb, &hb_version).await;
                }
            });

            // Metrics loop
            let mut sys = System::new();
            let mut disks = Disks::new();
            let mut nets = Networks::new();

            loop {
                let batch = collect_batch(&mut sys, &mut disks, &mut nets).await;
                if dry_run {
                    println!("{}", serde_json::to_string_pretty(&batch).unwrap());
                } else {
                    match send_batch(&client, &cli.server_url, &api_key, &batch).await {
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

fn detect_hostname() -> String {
    get_hostname_os().ok().and_then(|s| s.into_string().ok()).unwrap_or_else(|| "unknown-host".into())
}

fn detect_ip() -> String {
    match get_if_addrs::get_if_addrs() {
        Ok(addrs) => addrs
            .into_iter()
            .filter(|a| !a.is_loopback())
            .find_map(|a| match a.ip() {
                std::net::IpAddr::V4(v4) => Some(v4.to_string()),
                _ => None,
            })
            .unwrap_or_else(|| "127.0.0.1".into()),
        Err(_) => "127.0.0.1".into(),
    }
}

fn detect_os_string() -> String {
    let info = os_info::get();
    format!("{} {}", info.os_type(), info.version())
}

fn agent_version() -> String { env!("CARGO_PKG_VERSION").to_string() }

fn default_key_path() -> PathBuf {
    if let Ok(p) = std::env::var("CM_AGENT_KEY_FILE") { return PathBuf::from(p); }
    if let Some(home) = std::env::var_os("HOME") {
        return PathBuf::from(home).join(".config").join("cm-agent").join("api_key");
    }
    PathBuf::from(".cm-agent-api-key")
}

fn read_api_key_from_path(path: &PathBuf) -> Option<String> {
    match fs::read_to_string(path) {
        Ok(s) => Some(s.trim().to_string()),
        Err(_) => None,
    }
}

fn ensure_parent_dir(path: &PathBuf) -> std::io::Result<()> {
    if let Some(parent) = path.parent() { fs::create_dir_all(parent)?; }
    Ok(())
}

#[cfg(unix)]
fn set_secure_perms(path: &PathBuf) -> std::io::Result<()> {
    use std::os::unix::fs::PermissionsExt;
    let perms = fs::Permissions::from_mode(0o600);
    fs::set_permissions(path, perms)
}

#[cfg(not(unix))]
fn set_secure_perms(_path: &PathBuf) -> std::io::Result<()> { Ok(()) }

fn write_api_key_to_path(path: &PathBuf, key: &str) -> std::io::Result<()> {
    ensure_parent_dir(path)?;
    let mut f = fs::OpenOptions::new().create(true).write(true).truncate(true).open(path)?;
    f.write_all(key.as_bytes())?;
    set_secure_perms(path)?;
    Ok(())
}

async fn auto_register_and_persist(client: &reqwest::Client, base_url: &str) -> Result<String, AgentError> {
    let host = detect_hostname();
    let ip = detect_ip();
    let os_str = detect_os_string();
    let version = agent_version();
    let url = format!("{}/api/agent/register", base_url.trim_end_matches('/'));
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
        eprintln!("[cm-agent] auto-register failed: {}\n{}", status, text);
        return Err(AgentError::MissingApiKey);
    }
    let v: serde_json::Value = serde_json::from_str(&text)?;
    let api_key = v.get("apiKey").and_then(|x| x.as_str()).unwrap_or("").to_string();
    if api_key.is_empty() { return Err(AgentError::MissingApiKey); }
    let path = default_key_path();
    if let Err(e) = write_api_key_to_path(&path, &api_key) {
        eprintln!("[cm-agent] warning: failed to persist API key to {}: {}", path.display(), e);
    } else {
        println!("[cm-agent] obtained API key and saved to {}", path.display());
    }
    Ok(api_key)
}

async fn resolve_or_register_api_key(
    client: &reqwest::Client,
    base_url: &str,
    arg: Option<String>,
    file: Option<PathBuf>,
) -> Result<String, AgentError> {
    if let Some(k) = arg { return Ok(k); }
    if let Some(path) = file {
        if let Some(s) = read_api_key_from_path(&path) { return Ok(s); }
    }
    if let Ok(k) = std::env::var("API_KEY") { return Ok(k); }
    if let Ok(path) = std::env::var("API_KEY_FILE") { if let Some(s) = read_api_key_from_path(&PathBuf::from(path)) { return Ok(s); } }
    // Try default cached key
    let default_path = default_key_path();
    if let Some(s) = read_api_key_from_path(&default_path) { return Ok(s); }
    // Auto-register
    auto_register_and_persist(client, base_url).await
}

async fn send_heartbeat(client: &reqwest::Client, base_url: &str, api_key: &str, version: &str) -> Result<(), AgentError> {
    let url = format!("{}/api/agent/heartbeat", base_url.trim_end_matches('/'));
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert("X-API-Key", HeaderValue::from_str(api_key).unwrap_or_else(|_| HeaderValue::from_static("invalid")));
    let body = serde_json::json!({
        "status": "online",
        "agentVersion": version,
        "version": version
    });
    let _ = client.post(url).headers(headers).json(&body).send().await?;
    Ok(())
}
