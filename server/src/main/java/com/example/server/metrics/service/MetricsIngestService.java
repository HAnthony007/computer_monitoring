package com.example.server.metrics.service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.metrics.data.MetricsBatchRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MetricsIngestService {

    private final JdbcClient jdbcClient;

    @Transactional
    public void ingest(String computerId, MetricsBatchRequest req) {
        if (req.getCpu() != null && !req.getCpu().isEmpty()) {
            batchCpu(computerId, req.getCpu());
        }
        if (req.getMemory() != null && !req.getMemory().isEmpty()) {
            batchMemory(computerId, req.getMemory());
        }
        if (req.getDisks() != null && !req.getDisks().isEmpty()) {
            batchDisk(computerId, req.getDisks());
        }
        if (req.getNetwork() != null && !req.getNetwork().isEmpty()) {
            batchNetwork(computerId, req.getNetwork());
        }
    }

    private void batchCpu(String computerId, List<MetricsBatchRequest.CpuItem> items) {
        String sql = "INSERT INTO cpu (id_cpu, id_computer, cpu_name, usage_percent, temperature, recorded_at) " +
                "VALUES (?, ?, ?, ?, ?, ?)";
        for (var i : items) {
            String name = i.getCpu_name() != null && !i.getCpu_name().isBlank() ? i.getCpu_name() : "cpu";
            Double usage = i.getUsage_percent() != null ? i.getUsage_percent() : 0.0d;
            jdbcClient.sql(sql)
                .params(
                    genId("cpu"),
                    computerId,
                    name,
                    usage,
                    i.getTemperature(),
                    tsOrNow(i.getRecorded_at())
                )
                .update();
        }
    }

    private void batchMemory(String computerId, List<MetricsBatchRequest.MemoryItem> items) {
        String sql = "INSERT INTO memory (id_memory, id_computer, total_memory, used_memory, free_memory, recorded_at) " +
                "VALUES (?, ?, ?, ?, ?, ?)";
        for (var i : items) {
            long total = i.getTotal_memory() != null ? i.getTotal_memory() : 0L;
            long used = i.getUsed_memory() != null ? i.getUsed_memory() : 0L;
            Long freeVal = i.getFree_memory();
            long free = freeVal != null ? freeVal : Math.max(0L, total - used);
            jdbcClient.sql(sql)
                .params(
                    genId("mem"),
                    computerId,
                    total,
                    used,
                    free,
                    tsOrNow(i.getRecorded_at())
                )
                .update();
        }
    }

    private void batchDisk(String computerId, List<MetricsBatchRequest.DiskItem> items) {
        String sql = "INSERT INTO disk (id_disk, id_computer, disk_name, total_space, used_space, free_space, recorded_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?)";
        for (var i : items) {
            String name = i.getDisk_name() != null && !i.getDisk_name().isBlank() ? i.getDisk_name() : "/";
            long total = i.getTotal_space() != null ? i.getTotal_space() : 0L;
            long used = i.getUsed_space() != null ? i.getUsed_space() : 0L;
            Long freeVal = i.getFree_space();
            long free = freeVal != null ? freeVal : Math.max(0L, total - used);
            jdbcClient.sql(sql)
                .params(
                    genId("disk"),
                    computerId,
                    name,
                    total,
                    used,
                    free,
                    tsOrNow(i.getRecorded_at())
                )
                .update();
        }
    }

    private void batchNetwork(String computerId, List<MetricsBatchRequest.NetworkItem> items) {
        String sql = "INSERT INTO network (id_network, id_computer, interface_name, upload_speed, download_speed, total_upload, total_download, recorded_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        for (var i : items) {
            String iface = i.getInterface_name() != null && !i.getInterface_name().isBlank() ? i.getInterface_name() : "eth0";
            double up = i.getUpload_speed() != null ? i.getUpload_speed() : 0.0d;
            double down = i.getDownload_speed() != null ? i.getDownload_speed() : 0.0d;
            long totalUp = i.getTotal_upload() != null ? i.getTotal_upload() : 0L;
            long totalDown = i.getTotal_download() != null ? i.getTotal_download() : 0L;
            jdbcClient.sql(sql)
                .params(
                    genId("net"),
                    computerId,
                    iface,
                    up,
                    down,
                    totalUp,
                    totalDown,
                    tsOrNow(i.getRecorded_at())
                )
                .update();
        }
    }

    private static String genId(String prefix) {
        return prefix + "_" + java.util.UUID.randomUUID().toString().replace("-", "").substring(8);
    }

    private static Timestamp tsOrNow(Instant i) {
        return Timestamp.from(i != null ? i : Instant.now());
    }
}
