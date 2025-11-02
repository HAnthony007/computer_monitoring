use sysinfo::System;

pub fn collect_memory(sys: &mut System, recorded_at: Option<String>) -> Vec<crate::domain::MemoryPoint> {
	sys.refresh_memory();
	let total_mem = sys.total_memory();
	let used_mem = sys.used_memory();
	vec![crate::domain::MemoryPoint { total_mb: crate::utils::to_mb(total_mem), used_mb: crate::utils::to_mb(used_mem), recorded_at }]
}
