use sysinfo::Disks;

pub fn collect_disks(disks: &mut Disks, recorded_at: Option<String>) -> Vec<crate::domain::DiskPoint> {
	disks.refresh(true);
	let mut disks_vec = Vec::new();
	for d in disks.list() {
		let mp = d.mount_point().to_string_lossy().to_string();
		let total = d.total_space();
		let available = d.available_space();
		let used = total.saturating_sub(available);
		disks_vec.push(crate::domain::DiskPoint { mount_point: mp, total_gb: crate::utils::bytes_to_gb_f(total), used_gb: crate::utils::bytes_to_gb_f(used), recorded_at: recorded_at.clone() });
	}
	disks_vec
}
