package com.example.server.agents.service;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgentCommandsService {

    private final JdbcClient jdbcClient;

    @Transactional
    public String enqueueKillProcess(String computerId, long pid) {
        String id = "cmd_" + UUID.randomUUID().toString().replace("-", "");
        jdbcClient.sql("INSERT INTO agent_commands (id_command, id_computer, command_type, pid, status) VALUES (?,?,?,?, 'PENDING')")
            .param(id)
            .param(computerId)
            .param("KILL_PROCESS")
            .param(pid)
            .update();
        return id;
    }

    public record AgentCommand(String id, String type, Long pid) {}

    @Transactional
    public List<AgentCommand> pollPendingForComputer(String computerId, int limit) {
        // Fetch pending commands and mark as SENT (so they won't be re-fetched)
        String selectSql = "SELECT id_command, command_type, pid FROM agent_commands WHERE id_computer = ? AND status = 'PENDING' ORDER BY created_at ASC LIMIT ?";
        List<AgentCommand> cmds = jdbcClient.sql(selectSql)
            .param(computerId)
            .param(limit)
            .query((rs, rn) -> new AgentCommand(rs.getString("id_command"), rs.getString("command_type"), rs.getLong("pid")))
            .list();
        if (!cmds.isEmpty()) {
            String ids = cmds.stream().map(c -> "'" + c.id + "'").reduce((a,b) -> a+","+b).orElse("");
            String update = "UPDATE agent_commands SET status='SENT' WHERE id_command IN (" + ids + ")";
            jdbcClient.sql(update).update();
        }
        return cmds;
    }
}
