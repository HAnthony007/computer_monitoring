use serde::{Serialize, Deserialize};

#[derive(Serialize, Debug, Clone)]
pub struct CpuPoint {
    #[serde(rename = "usagePercent")]
    pub usage_percent: f64,
    #[serde(rename = "cpuName", skip_serializing_if = "Option::is_none")]
    pub cpu_name: Option<String>,
    #[serde(rename = "modelName", skip_serializing_if = "Option::is_none")]
    pub model_name: Option<String>,
    #[serde(rename = "coreCount", skip_serializing_if = "Option::is_none")]
    pub core_count: Option<u32>,
    #[serde(rename = "perCoreUsage", skip_serializing_if = "Option::is_none")]
    pub per_core_usage: Option<Vec<f64>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f64>,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    pub recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
pub struct MemoryPoint {
    #[serde(rename = "totalMb")]
    pub total_mb: u64,
    #[serde(rename = "usedMb")]
    pub used_mb: u64,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    pub recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
pub struct DiskPoint {
    #[serde(rename = "mountPoint")]
    pub mount_point: String,
    #[serde(rename = "totalGb")]
    pub total_gb: f64,
    #[serde(rename = "usedGb")]
    pub used_gb: f64,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    pub recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
pub struct NetworkPoint {
    #[serde(rename = "interface")]
    pub interface: String,
    #[serde(rename = "rxBytes")]
    pub rx_bytes: u64,
    #[serde(rename = "txBytes")]
    pub tx_bytes: u64,
    #[serde(rename = "uploadBps")]
    pub upload_bps: f64,
    #[serde(rename = "downloadBps")]
    pub download_bps: f64,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    pub recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone)]
pub struct ProcessPoint {
    #[serde(rename = "pid")] pub pid: i64,
    #[serde(rename = "program")] pub program: String,
    #[serde(rename = "command", skip_serializing_if = "Option::is_none")] pub command: Option<String>,
    #[serde(rename = "threads", skip_serializing_if = "Option::is_none")] pub threads: Option<u32>,
    #[serde(rename = "user", skip_serializing_if = "Option::is_none")] pub user: Option<String>,
    #[serde(rename = "memoryBytes", skip_serializing_if = "Option::is_none")] pub memory_bytes: Option<u64>,
    #[serde(rename = "cpuPercent", skip_serializing_if = "Option::is_none")] pub cpu_percent: Option<f64>,
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")] pub recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone, Default)]
pub struct BatchPayload {
    pub cpu: Vec<CpuPoint>,
    pub memory: Vec<MemoryPoint>,
    pub disks: Vec<DiskPoint>,
    pub network: Vec<NetworkPoint>,
    pub processes: Vec<ProcessPoint>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct AgentCommand {
    pub id: String,
    #[serde(rename = "type")]
    pub command_type: String,
    pub pid: Option<i64>,
}
