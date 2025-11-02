package com.example.server.computers.service;

import java.util.List;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.computers.Computer;
import com.example.server.computers.data.ComputerResponse;
import com.example.server.computers.repository.ComputerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComputersQueryService {

    private final ComputerRepository computerRepository;
    private final JdbcClient jdbcClient;

    @Transactional(readOnly = true)
    public List<ComputerResponse> listComputers() {
        List<ComputerResponse> items = computerRepository.findAll().stream().map(ComputerResponse::new).toList();
    // Join with agents (if any) to compute status/lastSeen (simple heuristic: latest agent by last_seen)
    // Portable approach: query latest agent per computer individually.
        for (var it : items) {
            var row = jdbcClient.sql("SELECT status, last_seen FROM agents WHERE id_computer = ? ORDER BY last_seen DESC NULLS LAST LIMIT 1")
                .param(it.getIdComputer())
                .query((rs, rn) -> new Object[]{rs.getString("status"), rs.getTimestamp("last_seen")})
                .optional()
                .orElse(null);
            if (row != null) {
                it.setStatus((String) row[0]);
                java.sql.Timestamp ts = (java.sql.Timestamp) row[1];
                it.setLastSeen(ts != null ? ts.toLocalDateTime() : null);
            } else {
                it.setStatus("UNKNOWN");
            }
        }
        return items;
    }

    @Transactional(readOnly = true)
    public ComputerResponse getById(String id) {
        Computer c = computerRepository.findById(id).orElseThrow();
        ComputerResponse resp = new ComputerResponse(c);
        var row = jdbcClient.sql("SELECT status, last_seen FROM agents WHERE id_computer = ? ORDER BY last_seen DESC NULLS LAST LIMIT 1")
            .param(id)
            .query((rs, rn) -> new Object[]{rs.getString("status"), rs.getTimestamp("last_seen")})
            .optional()
            .orElse(null);
        if (row != null) {
            resp.setStatus((String) row[0]);
            java.sql.Timestamp ts = (java.sql.Timestamp) row[1];
            resp.setLastSeen(ts != null ? ts.toLocalDateTime() : null);
        } else {
            resp.setStatus("UNKNOWN");
        }
        return resp;
    }

    @Transactional(readOnly = true)
    public List<com.example.server.agents.data.AgentResponse> listAgentsForComputer(String idComputer) {
        return jdbcClient.sql("SELECT id_agent FROM agents WHERE id_computer = ? ORDER BY created_at ASC")
            .param(idComputer)
            .query((rs, rn) -> rs.getString("id_agent"))
            .list()
            .stream()
            .map(agentId -> {
                // Query full row for response mapping
                return jdbcClient.sql("SELECT id_agent, id_computer, status, version, last_seen, created_at FROM agents WHERE id_agent = ?")
                    .param(agentId)
                    .query((rs2, rn2) -> {
                        com.example.server.agents.Agent ag = new com.example.server.agents.Agent();
                        ag.setIdAgent(rs2.getString("id_agent"));
                        ag.setIdComputer(rs2.getString("id_computer"));
                        ag.setStatus(rs2.getString("status"));
                        ag.setVersion(rs2.getString("version"));
                        var ts = rs2.getTimestamp("last_seen");
                        ag.setLastSeen(ts != null ? ts.toLocalDateTime() : null);
                        var created = rs2.getTimestamp("created_at");
                        ag.setCreatedAt(created != null ? created.toLocalDateTime() : null);
                        return new com.example.server.agents.data.AgentResponse(ag);
                    })
                    .optional()
                    .orElse(null);
            })
            .filter(java.util.Objects::nonNull)
            .toList();
    }
}
