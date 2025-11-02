use sysinfo::Networks;
use std::collections::HashMap;
use std::sync::{Mutex, OnceLock};
use std::time::Instant;

pub async fn collect_network(nets: &mut Networks, recorded_at: Option<String>) -> Vec<crate::domain::NetworkPoint> {
	nets.refresh(true);
	let mut network_vec = Vec::new();
	let now = Instant::now();
	let last = LAST_SNAPSHOT.get_or_init(|| Mutex::new(HashMap::new()));
	let mut guard = last.lock().ok();
	for (name, data) in nets.iter() {
		let rx = data.total_received();
		let tx = data.total_transmitted();

		// Compute speeds from deltas if we have a previous snapshot
		let (upload_bps, download_bps) = if let Some(ref mut map) = guard {
			if let Some(prev) = map.get(name) {
				let dt = now.duration_since(prev.2).as_secs_f64();
				let d_rx = rx.saturating_sub(prev.0) as f64; // total_received delta
				let d_tx = tx.saturating_sub(prev.1) as f64; // total_transmitted delta
				let down = if dt > 0.0 { d_rx / dt } else { 0.0 };
				let up = if dt > 0.0 { d_tx / dt } else { 0.0 };
				(up.max(0.0), down.max(0.0))
			} else {
				(0.0, 0.0)
			}
		} else {
			(0.0, 0.0)
		};

		if let Some(ref mut map) = guard { map.insert(name.to_string(), (rx, tx, now)); }

		network_vec.push(crate::domain::NetworkPoint {
			interface: name.to_string(),
			rx_bytes: rx,
			tx_bytes: tx,
			upload_bps,
			download_bps,
			recorded_at: recorded_at.clone(),
		});
	}
	network_vec
}

// Keep last totals per interface to compute instantaneous speeds
static LAST_SNAPSHOT: OnceLock<Mutex<HashMap<String, (u64 /*rx*/, u64 /*tx*/, Instant)>>> = OnceLock::new();
