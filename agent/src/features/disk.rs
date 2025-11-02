use sysinfo::{Disks, DiskKind};

fn is_desired_mount(mount_point: &str) -> bool {
	// Windows: include drive roots like "C:\" (or with forward slash variant)
	#[cfg(target_os = "windows")]
	{
		let mp = mount_point.replace('/', "\\");
		let bytes = mp.as_bytes();
		if bytes.len() >= 2 && bytes[1] == b':' {
			// e.g., C: or C:\
			return true;
		}
		return false;
	}

	// macOS: keep "/" and volumes under "/Volumes/..."; apply similar top-level filtering as Linux
	#[cfg(target_os = "macos")]
	{
		if mount_point == "/" { return true; }
		if mount_point.starts_with("/Volumes/") { return true; }

		if mount_point.starts_with("/.") { return false; }
		let sys_prefixes = [
			"/proc", "/sys", "/dev", "/run", "/tmp",
		];
		if sys_prefixes.iter().any(|p| mount_point == *p || mount_point.starts_with(&format!("{}/", p))) {
			return false;
		}
		let seg = mount_point.trim_start_matches('/').split('/').next().unwrap_or("");
		let depth = mount_point.matches('/').count();
		let excluded_top = [
			"System", "Users", "Volumes", "private", "usr", "var", "etc", "bin", "sbin", "opt", "tmp",
		];
		if depth == 1 && !excluded_top.contains(&seg) && !seg.is_empty() { return true; }
		return false;
	}

	// Default (Linux/others): previous Linux-centric rules
	#[cfg(not(any(target_os = "windows", target_os = "macos")))]
	{
		// Always keep root
		if mount_point == "/" { return true; }

		// Drop hidden/system snapshots
		if mount_point.starts_with("/.") { return false; }

		// System and runtime mounts to ignore entirely
		let sys_prefixes = [
			"/proc",
			"/sys",
			"/dev",
			"/run",
			"/snap",
			"/var/lib/docker",
			"/var/lib/containers",
			"/var/snap",
			"/tmp",
		];
		if sys_prefixes.iter().any(|p| mount_point == *p || mount_point.starts_with(&format!("{}/", p))) {
			return false;
		}

		// Allow typical extra disks: mounts under /mnt or /media
		if mount_point.starts_with("/mnt/") || mount_point.starts_with("/media/") { return true; }

		// Only consider top-level mounts like /data, /srv, etc., but exclude core OS dirs
		// Extract first segment after '/'
		let seg = mount_point.trim_start_matches('/').split('/').next().unwrap_or("");
		let depth = mount_point.matches('/').count(); // '/' count: '/' -> 1, '/data' -> 1, '/data/x' -> 2+
		let excluded_top = [
			"home", "boot", "usr", "var", "etc", "bin", "sbin", "lib", "lib64", "root", "opt",
		];
		if depth == 1 && !excluded_top.contains(&seg) && !seg.is_empty() {
			return true; // e.g., /data, /srv, /storage
		}

		return false;
	}
}

fn is_virtual_fs(fs: &str) -> bool {
	let fs = fs.to_lowercase();
	let virtual_list = [
		"tmpfs",
		"devtmpfs",
		"proc",
		"sysfs",
		"cgroup",
		"cgroup2",
		"overlay",
		"squashfs",
		"aufs",
		"ramfs",
		"efivarfs",
		"configfs",
		"securityfs",
		"pstore",
		"autofs",
		"debugfs",
		"mqueue",
		"hugetlbfs",
		"tracefs",
		"nsfs",
		"bpf",
		"fusectl",
		"fuse.lxcfs",
	];
	virtual_list.iter().any(|v| fs == *v || fs.starts_with("fuse."))
}

pub fn collect_disks(disks: &mut Disks, recorded_at: Option<String>) -> Vec<crate::domain::DiskPoint> {
	disks.refresh(true);
	let mut disks_vec = Vec::new();
	for d in disks.list() {
		let mp = d.mount_point().to_string_lossy().to_string();
	if !is_desired_mount(&mp) { continue; }

		// Prefer DiskKind classification when available
		let kind_ok = matches!(d.kind(), DiskKind::HDD | DiskKind::SSD);
		// Fallback to fs filtering when kind is unknown
	let fs_str = d.file_system().to_string_lossy().to_string();
		let fs_ok = !is_virtual_fs(&fs_str);
	if !(kind_ok || fs_ok) { continue; }

		let total = d.total_space();
		let available = d.available_space();
		let used = total.saturating_sub(available);
		disks_vec.push(crate::domain::DiskPoint { mount_point: mp, total_gb: crate::utils::bytes_to_gb_f(total), used_gb: crate::utils::bytes_to_gb_f(used), recorded_at: recorded_at.clone() });
	}
	disks_vec
}
