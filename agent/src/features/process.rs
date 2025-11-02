use sysinfo::{System, ProcessesToUpdate};
use std::fs;
use std::path::Path;
use std::time::Duration;

pub async fn collect_processes(sys: &mut System, recorded_at: Option<String>) -> Vec<crate::domain::ProcessPoint> {
    // For non-zero cpu_percent, we need two refreshes separated by a short delay
    sys.refresh_processes(ProcessesToUpdate::All, true);
    tokio::time::sleep(Duration::from_millis(250)).await;
    sys.refresh_processes(ProcessesToUpdate::All, true);

    let mut out = Vec::new();
    for (pid, p) in sys.processes() {
        // PID as i64
    let pid_i = pid.as_u32() as i64;

        // Program name and command line (best-effort)
    let program = p.name().to_string_lossy().to_string();
        let command = join_cmdline_linux(pid_i).or_else(|| {
            let parts = p.cmd();
            if parts.is_empty() { None } else {
                Some(parts.iter().map(|s| s.to_string_lossy().to_string()).collect::<Vec<_>>().join(" "))
            }
        });

        // Threads and user via /proc/<pid>/status
        let (threads, uid) = read_status_linux(pid_i);
        let user = uid.and_then(resolve_username_linux);

        // Memory and cpu usage
        let mem_bytes = Some(p.memory());
        let cpu_percent = Some(p.cpu_usage() as f64);

        out.push(crate::domain::ProcessPoint {
            pid: pid_i,
            program,
            command,
            threads,
            user,
            memory_bytes: mem_bytes,
            cpu_percent,
            recorded_at: recorded_at.clone(),
        });
    }
    out
}

fn join_cmdline_linux(pid: i64) -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        let path = format!("/proc/{}/cmdline", pid);
        if let Ok(buf) = fs::read(path) {
            // cmdline is NUL-separated
            let parts: Vec<String> = buf.split(|b| *b == 0)
                .filter(|s| !s.is_empty())
                .map(|s| String::from_utf8_lossy(s).to_string())
                .collect();
            if !parts.is_empty() { return Some(parts.join(" ")); }
        }
    }
    None
}

fn read_status_linux(pid: i64) -> (Option<u32>, Option<u32>) {
    #[cfg(target_os = "linux")]
    {
        let path = format!("/proc/{}/status", pid);
        if let Ok(text) = fs::read_to_string(path) {
            let mut threads: Option<u32> = None;
            let mut uid: Option<u32> = None;
            for line in text.lines() {
                if line.starts_with("Threads:") {
                    if let Some(val) = line.split_whitespace().nth(1) { threads = val.parse::<u32>().ok(); }
                } else if line.starts_with("Uid:") {
                    if let Some(val) = line.split_whitespace().nth(1) { uid = val.parse::<u32>().ok(); }
                }
                if threads.is_some() && uid.is_some() { break; }
            }
            return (threads, uid);
        }
    }
    (None, None)
}

fn resolve_username_linux(uid: u32) -> Option<String> {
    #[cfg(target_os = "linux")]
    {
        if let Ok(text) = fs::read_to_string(Path::new("/etc/passwd")) {
            for line in text.lines() {
                if line.starts_with('#') || line.trim().is_empty() { continue; }
                let mut parts = line.split(':');
                let name = parts.next()?;
                let _x = parts.next()?; // x
                let uid_str = parts.next()?;
                if uid_str.parse::<u32>().ok()? == uid { return Some(name.to_string()); }
            }
        }
    }
    None
}
