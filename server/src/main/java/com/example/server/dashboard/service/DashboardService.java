package com.example.server.dashboard.service;

import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.dashboard.data.ComputerSummaryResponse;
import com.example.server.dashboard.data.DashboardStatsResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JdbcClient jdbcClient;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        DashboardStatsResponse s = new DashboardStatsResponse();
        s.setTotalComputers(count("computers"));
        s.setTotalAgents(count("agents"));
        s.setActiveAgents(countWhere("agents", "status = 'ONLINE'"));
        s.setActiveComputers(countDistinctComputersWithOnlineAgent());
        s.setInactiveComputers(Math.max(0, s.getTotalComputers() - s.getActiveComputers()));
        // Average uptime in seconds across agents with data (or online agents)
        Long avgUptime = avgUptimeSeconds();
        s.setAverageUptime(avgUptime != null ? avgUptime.doubleValue() : null);
        // Availability rate = activeComputers / totalComputers * 100
        if (s.getTotalComputers() > 0) {
            s.setAvailabilityRate(100.0 * s.getActiveComputers() / s.getTotalComputers());
        } else {
            s.setAvailabilityRate(0.0);
        }
        return s;
    }

    @Transactional(readOnly = true)
    public List<ComputerSummaryResponse> getComputersSummary() {
        String sql = """
            SELECT c.id_computer, c.hostname, c.ip_adress, a.status, a.last_seen,
                   (SELECT usage_percent FROM cpu WHERE id_computer = c.id_computer ORDER BY recorded_at DESC LIMIT 1) AS latest_cpu,
                   (SELECT used_memory::float / NULLIF(total_memory,0) * 100 FROM memory WHERE id_computer = c.id_computer ORDER BY recorded_at DESC LIMIT 1) AS latest_mem
            FROM computers c
            LEFT JOIN LATERAL (
                SELECT status, last_seen
                FROM agents
                WHERE id_computer = c.id_computer
                ORDER BY last_seen DESC NULLS LAST
                LIMIT 1
            ) a ON true
            ORDER BY c.hostname ASC
        """;
        return jdbcClient.sql(sql)
            .query((rs, rn) -> {
                ComputerSummaryResponse r = new ComputerSummaryResponse();
                r.setIdComputer(rs.getString("id_computer"));
                r.setHostname(rs.getString("hostname"));
                r.setIpAddress(rs.getString("ip_adress"));
                r.setStatus(rs.getString("status") != null ? rs.getString("status") : "UNKNOWN");
                var ts = rs.getTimestamp("last_seen");
                r.setLastSeen(ts != null ? ts.toLocalDateTime() : null);
                var cpu = (Double) rs.getObject("latest_cpu");
                r.setLatestCpuUsage(cpu);
                var mem = (Double) rs.getObject("latest_mem");
                r.setLatestMemoryUsage(mem);
                return r;
            })
            .list();
    }

    private long count(String table) {
        return jdbcClient.sql("SELECT COUNT(*) FROM " + table).query(Long.class).single();
    }

    private long countWhere(String table, String where) {
        return jdbcClient.sql("SELECT COUNT(*) FROM " + table + " WHERE " + where).query(Long.class).single();
    }

    private long countDistinctComputersWithOnlineAgent() {
        String sql = "SELECT COUNT(DISTINCT id_computer) FROM agents WHERE status='ONLINE'";
        return jdbcClient.sql(sql).query(Long.class).single();
    }

    private Long avgUptimeSeconds() {
        String sql = "SELECT AVG(uptime_seconds) FROM agents WHERE uptime_seconds IS NOT NULL";
        return jdbcClient.sql(sql).query(Long.class).optional().orElse(null);
    }
}
