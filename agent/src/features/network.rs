use sysinfo::Networks;

pub async fn collect_network(nets: &mut Networks, recorded_at: Option<String>) -> Vec<crate::domain::NetworkPoint> {
	nets.refresh(true);
	let mut network_vec = Vec::new();
	for (name, data) in nets.iter() {
		network_vec.push(crate::domain::NetworkPoint {
			interface: name.to_string(),
			rx_bytes: data.total_received(),
			tx_bytes: data.total_transmitted(),
			recorded_at: recorded_at.clone(),
		});
	}
	network_vec
}
