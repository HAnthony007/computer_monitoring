package com.example.server.metrics.service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.metrics.data.MetricsReadModels.CpuMetric;
import com.example.server.metrics.data.MetricsReadModels.DiskMetric;
import com.example.server.metrics.data.MetricsReadModels.LatestMetricsResponse;
import com.example.server.metrics.data.MetricsReadModels.MemoryMetric;
import com.example.server.metrics.data.MetricsReadModels.MetricsHistoryResponse;
import com.example.server.metrics.data.MetricsReadModels.NetworkMetric;
import com.example.server.metrics.data.MetricsReadModels.Pagination;
import com.example.server.metrics.data.MetricsReadModels.ProcessMetric;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MetricsReadService {

    private final JdbcClient jdbcClient;
    private static final com.fasterxml.jackson.databind.ObjectMapper MAPPER = new com.fasterxml.jackson.databind.ObjectMapper();

    @Transactional(readOnly = true)
    public LatestMetricsResponse latest(String computerId) {
        LatestMetricsResponse resp = new LatestMetricsResponse();
        resp.setComputerId(computerId);
        resp.setRecordedAt(Instant.now());
        resp.setCpu(fetchLatestCpu(computerId));
        resp.setMemory(fetchLatestMemory(computerId));
        resp.setDisks(fetchLatestDisks(computerId));
        resp.setNetwork(fetchLatestNetwork(computerId));
        // include latest processes snapshot (limited)
        resp.setProcesses(fetchLatestProcesses(computerId, 100));
        return resp;
    }

    @Transactional(readOnly = true)
    public MetricsHistoryResponse history(String computerId, String type, Instant from, Instant to, int limit, int offset) {
        MetricsHistoryResponse resp = new MetricsHistoryResponse();
        resp.setComputerId(computerId);
        List<LatestMetricsResponse> list = new ArrayList<>();
        LatestMetricsResponse frame = new LatestMetricsResponse();
        frame.setComputerId(computerId);
        if ("cpu".equalsIgnoreCase(type)) {
            frame.setCpu(fetchCpuRange(computerId, from, to, limit, offset));
        } else if ("memory".equalsIgnoreCase(type)) {
            frame.setMemory(fetchMemorySingle(computerId, from, to));
        } else if ("disk".equalsIgnoreCase(type)) {
            frame.setDisks(fetchDiskRange(computerId, from, to, limit, offset));
        } else if ("network".equalsIgnoreCase(type)) {
            frame.setNetwork(fetchNetworkRange(computerId, from, to, limit, offset));
        } else if ("processes".equalsIgnoreCase(type)) {
            frame.setProcesses(fetchProcessesRange(computerId, from, to, limit, offset));
        } else {
            // default: latest
            frame = latest(computerId);
        }
        list.add(frame);
        resp.setMetrics(list);
        Pagination p = new Pagination();
        p.setTotal(list.size());
        p.setLimit(limit);
        p.setOffset(offset);
        resp.setPagination(p);
        return resp;
    }

    private List<CpuMetric> fetchLatestCpu(String computerId) {
        String sql = "SELECT cpu_name, usage_percent, temperature, model_name, core_count, per_core_usage, recorded_at "
                + "FROM cpu WHERE id_computer = ? AND recorded_at = (SELECT MAX(recorded_at) FROM cpu WHERE id_computer = ?)";
        return jdbcClient.sql(sql)
            .params(List.of(computerId, computerId))
            .query((rs, rn) -> {
                CpuMetric m = new CpuMetric();
                m.setCpuName(rs.getString("cpu_name"));
                m.setUsagePercent(rs.getDouble("usage_percent"));
                m.setTemperature((Double) rs.getObject("temperature"));
                m.setModelName(rs.getString("model_name"));
                m.setCoreCount((Integer) rs.getObject("core_count"));
                // per_core_usage stored as JSON string; parse into List<Double>
                String perCoreJson = rs.getString("per_core_usage");
                if (perCoreJson != null) {
                    try {
                        java.util.List<Double> list = MAPPER.readValue(
                            perCoreJson,
                            MAPPER.getTypeFactory().constructCollectionType(java.util.List.class, Double.class)
                        );
                        m.setPerCoreUsage(list);
                    } catch (Exception ignore) {}
                }
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private MemoryMetric fetchLatestMemory(String computerId) {
        String sql = "SELECT total_memory, used_memory, free_memory, recorded_at FROM memory WHERE id_computer = ? ORDER BY recorded_at DESC LIMIT 1";
        return jdbcClient.sql(sql)
            .param(computerId)
            .query((rs, rn) -> {
                MemoryMetric m = new MemoryMetric();
                m.setTotalMb(rs.getLong("total_memory"));
                m.setUsedMb(rs.getLong("used_memory"));
                m.setFreeMb(rs.getLong("free_memory"));
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                if (m.getTotalMb() != null && m.getTotalMb() > 0) {
                    m.setUsagePercent(100.0 * m.getUsedMb() / m.getTotalMb());
                }
                return m;
            })
            .optional().orElse(null);
    }

    private List<DiskMetric> fetchLatestDisks(String computerId) {
        String sql = "SELECT disk_name, total_space, used_space, free_space, recorded_at FROM disk WHERE id_computer = ? AND recorded_at = (SELECT MAX(recorded_at) FROM disk WHERE id_computer = ?)";
        return jdbcClient.sql(sql)
            .params(List.of(computerId, computerId))
            .query((rs, rn) -> {
                DiskMetric m = new DiskMetric();
                m.setDiskName(rs.getString("disk_name"));
                m.setMountPoint(rs.getString("disk_name"));
                m.setTotalGb(rs.getLong("total_space"));
                m.setUsedGb(rs.getLong("used_space"));
                m.setFreeGb(rs.getLong("free_space"));
                if (m.getTotalGb() != null && m.getTotalGb() > 0) {
                    m.setUsagePercent(100.0 * m.getUsedGb() / m.getTotalGb());
                }
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private List<NetworkMetric> fetchLatestNetwork(String computerId) {
        String sql = "SELECT interface_name, upload_speed, download_speed, total_upload, total_download, recorded_at FROM network WHERE id_computer = ? AND recorded_at = (SELECT MAX(recorded_at) FROM network WHERE id_computer = ?)";
        return jdbcClient.sql(sql)
            .params(List.of(computerId, computerId))
            .query((rs, rn) -> {
                NetworkMetric m = new NetworkMetric();
                m.setInterfaceName(rs.getString("interface_name"));
                m.setUploadSpeed((Double) rs.getObject("upload_speed"));
                m.setDownloadSpeed((Double) rs.getObject("download_speed"));
                m.setTotalUpload(rs.getLong("total_upload"));
                m.setTotalDownload(rs.getLong("total_download"));
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private List<CpuMetric> fetchCpuRange(String computerId, Instant from, Instant to, int limit, int offset) {
        String sql = baseRangeSql("cpu", "recorded_at") + " ORDER BY recorded_at DESC LIMIT :limit OFFSET :offset";
        return jdbcClient.sql(sql)
            .params(Map.of("id", computerId, "from", ts(from), "to", ts(to), "limit", limit, "offset", offset))
            .query((rs, rn) -> {
                CpuMetric m = new CpuMetric();
                m.setCpuName(rs.getString("cpu_name"));
                m.setUsagePercent(rs.getDouble("usage_percent"));
                m.setTemperature((Double) rs.getObject("temperature"));
                m.setModelName(rs.getString("model_name"));
                m.setCoreCount((Integer) rs.getObject("core_count"));
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private MemoryMetric fetchMemorySingle(String computerId, Instant from, Instant to) {
        String sql = baseRangeSql("memory", "recorded_at") + " ORDER BY recorded_at DESC LIMIT 1";
        return jdbcClient.sql(sql)
            .params(Map.of("id", computerId, "from", ts(from), "to", ts(to)))
            .query((rs, rn) -> {
                MemoryMetric m = new MemoryMetric();
                m.setTotalMb(rs.getLong("total_memory"));
                m.setUsedMb(rs.getLong("used_memory"));
                m.setFreeMb(rs.getLong("free_memory"));
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                if (m.getTotalMb() != null && m.getTotalMb() > 0) {
                    m.setUsagePercent(100.0 * m.getUsedMb() / m.getTotalMb());
                }
                return m;
            })
            .optional().orElse(null);
    }

    private List<DiskMetric> fetchDiskRange(String computerId, Instant from, Instant to, int limit, int offset) {
        String sql = baseRangeSql("disk", "recorded_at") + " ORDER BY recorded_at DESC LIMIT :limit OFFSET :offset";
        return jdbcClient.sql(sql)
            .params(Map.of("id", computerId, "from", ts(from), "to", ts(to), "limit", limit, "offset", offset))
            .query((rs, rn) -> {
                DiskMetric m = new DiskMetric();
                m.setDiskName(rs.getString("disk_name"));
                m.setMountPoint(rs.getString("disk_name"));
                m.setTotalGb(rs.getLong("total_space"));
                m.setUsedGb(rs.getLong("used_space"));
                m.setFreeGb(rs.getLong("free_space"));
                if (m.getTotalGb() != null && m.getTotalGb() > 0) {
                    m.setUsagePercent(100.0 * m.getUsedGb() / m.getTotalGb());
                }
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private List<NetworkMetric> fetchNetworkRange(String computerId, Instant from, Instant to, int limit, int offset) {
        String sql = baseRangeSql("network", "recorded_at") + " ORDER BY recorded_at DESC LIMIT :limit OFFSET :offset";
        return jdbcClient.sql(sql)
            .params(Map.of("id", computerId, "from", ts(from), "to", ts(to), "limit", limit, "offset", offset))
            .query((rs, rn) -> {
                NetworkMetric m = new NetworkMetric();
                m.setInterfaceName(rs.getString("interface_name"));
                m.setUploadSpeed((Double) rs.getObject("upload_speed"));
                m.setDownloadSpeed((Double) rs.getObject("download_speed"));
                m.setTotalUpload(rs.getLong("total_upload"));
                m.setTotalDownload(rs.getLong("total_download"));
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private List<ProcessMetric> fetchProcessesRange(String computerId, Instant from, Instant to, int limit, int offset) {
        String sql = baseRangeSql("process", "recorded_at") + " ORDER BY recorded_at DESC LIMIT :limit OFFSET :offset";
        return jdbcClient.sql(sql)
            .params(Map.of("id", computerId, "from", ts(from), "to", ts(to), "limit", limit, "offset", offset))
            .query((rs, rn) -> {
                ProcessMetric m = new ProcessMetric();
                m.setPid(rs.getLong("pid"));
                m.setProgram(rs.getString("program"));
                m.setCommand(rs.getString("command"));
                m.setThreads((Integer) rs.getObject("threads"));
                m.setUsername(rs.getString("username"));
                m.setMemoryBytes((Long) rs.getObject("memory_bytes"));
                m.setCpuPercent((Double) rs.getObject("cpu_percent"));
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private List<ProcessMetric> fetchLatestProcesses(String computerId, int limit) {
        String sql = "SELECT pid, program, command, threads, username, memory_bytes, cpu_percent, recorded_at "
                + "FROM process WHERE id_computer = ? AND recorded_at = (SELECT MAX(recorded_at) FROM process WHERE id_computer = ?) "
                + "ORDER BY cpu_percent DESC NULLS LAST, memory_bytes DESC NULLS LAST LIMIT ?";
        return jdbcClient.sql(sql)
            .params(List.of(computerId, computerId, limit))
            .query((rs, rn) -> {
                ProcessMetric m = new ProcessMetric();
                m.setPid(rs.getLong("pid"));
                m.setProgram(rs.getString("program"));
                m.setCommand(rs.getString("command"));
                m.setThreads((Integer) rs.getObject("threads"));
                m.setUsername(rs.getString("username"));
                m.setMemoryBytes((Long) rs.getObject("memory_bytes"));
                m.setCpuPercent((Double) rs.getObject("cpu_percent"));
                m.setRecordedAt(tsToInstant(rs.getTimestamp("recorded_at")));
                return m;
            })
            .list();
    }

    private String baseRangeSql(String table, String tsCol) {
        return "SELECT * FROM " + table + " WHERE id_computer = :id " +
               (" AND (:from IS NULL OR " + tsCol + ">=:from) AND (:to IS NULL OR " + tsCol + "<=:to)");
    }

    private static Instant tsToInstant(Timestamp ts) { return ts != null ? ts.toInstant() : null; }
    private static Timestamp ts(Instant i) { return i != null ? Timestamp.from(i) : null; }
}
