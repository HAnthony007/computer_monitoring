use crate::utils::now_iso;
use crate::domain::BatchPayload;
use sysinfo::{Disks, Networks, System};
use std::time::Duration;

pub async fn collect_batch(sys: &mut System, disks: &mut Disks, nets: &mut Networks) -> BatchPayload {
    // Refresh CPU twice to get a meaningful usage percentage
    sys.refresh_cpu_all();
    tokio::time::sleep(Duration::from_millis(500)).await;
    sys.refresh_cpu_all();

    let recorded_at = Some(now_iso());

    // Delegate feature-specific collection
    let cpu = crate::features::cpu::collect_cpu(sys, recorded_at.clone()).await;
    let memory = crate::features::memory::collect_memory(sys, recorded_at.clone());
    let disks_vec = crate::features::disk::collect_disks(disks, recorded_at.clone());
    let network_vec = crate::features::network::collect_network(nets, recorded_at.clone()).await;

    BatchPayload { cpu, memory, disks: disks_vec, network: network_vec }
}
