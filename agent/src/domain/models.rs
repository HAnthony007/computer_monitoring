use serde::Serialize;

#[derive(Serialize, Debug, Clone)]
pub struct CpuPoint {
    #[serde(rename = "usagePercent")]
    pub usage_percent: f64,
    #[serde(rename = "cpuName", skip_serializing_if = "Option::is_none")]
    pub cpu_name: Option<String>,
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
    #[serde(rename = "recordedAt", skip_serializing_if = "Option::is_none")]
    pub recorded_at: Option<String>,
}

#[derive(Serialize, Debug, Clone, Default)]
pub struct BatchPayload {
    pub cpu: Vec<CpuPoint>,
    pub memory: Vec<MemoryPoint>,
    pub disks: Vec<DiskPoint>,
    pub network: Vec<NetworkPoint>,
}
