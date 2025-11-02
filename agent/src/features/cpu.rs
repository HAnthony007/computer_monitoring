use sysinfo::System;

pub async fn collect_cpu(sys: &mut System, recorded_at: Option<String>) -> Vec<crate::domain::CpuPoint> {
	sys.refresh_cpu_all();
	tokio::time::sleep(std::time::Duration::from_millis(1)).await; // short sleep if needed
	sys.refresh_cpu_all();
	let cpu_usage = sys.global_cpu_usage() as f64;
	vec![crate::domain::CpuPoint { usage_percent: cpu_usage, cpu_name: Some("cpu".into()), recorded_at }]
}
