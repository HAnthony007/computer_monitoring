use sysinfo::System;

pub async fn collect_cpu(sys: &mut System, recorded_at: Option<String>) -> Vec<crate::domain::CpuPoint> {
	sys.refresh_cpu_all();
	tokio::time::sleep(std::time::Duration::from_millis(1)).await; // short sleep if needed
	sys.refresh_cpu_all();
	let cpu_usage = sys.global_cpu_usage() as f64;

	// Model name from /proc/cpuinfo (Linux)
	let model_name = read_cpu_model_name();

	// Per-core usages and core count
	let per_core: Vec<f64> = sys
		.cpus()
		.iter()
		.map(|c| c.cpu_usage() as f64)
		.collect();
	let core_count = Some(per_core.len() as u32);

	// Best-effort temperature detection (may be None on some systems)
	let temperature = read_cpu_temperature();

	vec![crate::domain::CpuPoint {
		usage_percent: cpu_usage,
		cpu_name: Some("cpu".into()),
		model_name,
		core_count,
		per_core_usage: Some(per_core),
		temperature,
		recorded_at,
	}]
}

fn read_cpu_model_name() -> Option<String> {
	#[cfg(target_os = "linux")]
	{
		if let Ok(content) = std::fs::read_to_string("/proc/cpuinfo") {
			for line in content.lines() {
				if let Some(rest) = line.strip_prefix("model name\t: ") {
					return Some(rest.trim().to_string());
				}
			}
		}
	}
	None
}

fn read_cpu_temperature() -> Option<f64> {
	#[cfg(target_os = "linux")]
	{
		use std::fs;
		use std::path::Path;
		let base = Path::new("/sys/class/thermal");
		if let Ok(entries) = fs::read_dir(base) {
			for entry in entries.flatten() {
				let p = entry.path();
				if p.file_name().and_then(|s| s.to_str()).map(|s| s.starts_with("thermal_zone")).unwrap_or(false) {
					let type_path = p.join("type");
					let temp_path = p.join("temp");
					let typ = fs::read_to_string(&type_path).unwrap_or_default().to_lowercase();
					if typ.contains("cpu") || typ.contains("x86_pkg_temp") || typ.contains("core") {
						if let Ok(t) = fs::read_to_string(&temp_path) {
							if let Ok(val) = t.trim().parse::<f64>() {
								// Most sysfs temps are in millidegrees C
								return Some(if val > 1000.0 { val / 1000.0 } else { val });
							}
						}
					}
				}
			}
		}
	}
	None
}
