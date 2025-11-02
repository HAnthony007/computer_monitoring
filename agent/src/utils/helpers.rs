use chrono::{SecondsFormat, Utc};

pub fn now_iso() -> String {
    Utc::now().to_rfc3339_opts(SecondsFormat::Secs, true)
}

pub fn to_mb(bytes: u64) -> u64 { bytes / 1024 / 1024 }
pub fn bytes_to_gb_f(bytes: u64) -> f64 { (bytes as f64) / 1024.0 / 1024.0 / 1024.0 }
