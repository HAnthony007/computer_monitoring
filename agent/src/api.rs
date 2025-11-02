use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use serde_json::json;
use std::path::PathBuf;

use crate::domain::AgentError;

pub async fn send_batch(client: &reqwest::Client, base_url: &str, api_key: &str, payload: &crate::domain::BatchPayload) -> Result<(), AgentError> {
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

pub async fn send_heartbeat(client: &reqwest::Client, base_url: &str, api_key: &str, version: &str) -> Result<(), AgentError> {
    let url = format!("{}/api/agent/heartbeat", base_url.trim_end_matches('/'));
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, HeaderValue::from_static("application/json"));
    headers.insert("X-API-Key", HeaderValue::from_str(api_key).unwrap_or_else(|_| HeaderValue::from_static("invalid")));
    let body = json!({
        "status": "online",
        "agentVersion": version,
        "version": version
    });
    let _ = client.post(url).headers(headers).json(&body).send().await?;
    Ok(())
}

pub async fn auto_register_and_persist(client: &reqwest::Client, base_url: &str) -> Result<String, AgentError> {
    let host = crate::utils::detect_hostname();
    let ip = crate::utils::detect_ip();
    let os_str = crate::utils::detect_os_string();
    let version = crate::utils::agent_version();
    let url = format!("{}/api/agent/register", base_url.trim_end_matches('/'));
    let body = json!({
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
    let path = crate::utils::default_key_path();
    if let Err(e) = crate::utils::write_api_key_to_path(&path, &api_key) {
        eprintln!("[cm-agent] warning: failed to persist API key to {}: {}", path.display(), e);
    } else {
        println!("[cm-agent] obtained API key and saved to {}", path.display());
    }
    Ok(api_key)
}

pub async fn resolve_or_register_api_key(
    client: &reqwest::Client,
    base_url: &str,
    arg: Option<String>,
    file: Option<PathBuf>,
) -> Result<String, AgentError> {
    if let Some(k) = arg { return Ok(k); }
    if let Some(path) = file {
        if let Some(s) = crate::utils::read_api_key_from_path(&path) { return Ok(s); }
    }
    if let Ok(k) = std::env::var("API_KEY") { return Ok(k); }
    if let Ok(path) = std::env::var("API_KEY_FILE") { if let Some(s) = crate::utils::read_api_key_from_path(&PathBuf::from(path)) { return Ok(s); } }
    // Try default cached key
    let default_path = crate::utils::default_key_path();
    if let Some(s) = crate::utils::read_api_key_from_path(&default_path) { return Ok(s); }
    // Auto-register
    auto_register_and_persist(client, base_url).await
}
