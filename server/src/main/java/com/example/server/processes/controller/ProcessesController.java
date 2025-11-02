package com.example.server.processes.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.agents.service.AgentCommandsService;
import com.example.server.auth.SecurityUtil;
import com.example.server.users.Role;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/computers/{computerId}/processes")
public class ProcessesController {

    private final JdbcClient jdbcClient;
    private final AgentCommandsService commandsService;

    @PostMapping("/{pid}/kill")
    public ResponseEntity<Void> killProcess(
            @PathVariable("computerId") String computerId,
            @PathVariable("pid") long pid) {
        // Permission: only ADMIN for now
        var user = SecurityUtil.getAuthentificatedUser();
        if (user.getRole() != Role.ADMIN) {
            throw new AuthorizationDeniedException("Insufficient permissions");
        }
        // Check computer exists
        boolean computerExists = jdbcClient.sql("SELECT 1 FROM computers WHERE id_computer = ? LIMIT 1")
                .param(computerId)
                .query((rs, rn) -> 1)
                .optional()
                .isPresent();
        if (!computerExists) {
            return ResponseEntity.notFound().build();
        }
        // Check process existence on latest snapshot for computer
        String sql = "SELECT 1 FROM process WHERE id_computer = ? AND pid = ? AND recorded_at = (SELECT MAX(recorded_at) FROM process WHERE id_computer = ?) LIMIT 1";
        boolean processExists = jdbcClient.sql(sql)
                .param(computerId)
                .param(pid)
                .param(computerId)
                .query((rs, rn) -> 1)
                .optional()
                .isPresent();
        if (!processExists) {
            return ResponseEntity.notFound().build();
        }
        // Enqueue command
        commandsService.enqueueKillProcess(computerId, pid);
        return ResponseEntity.ok().build();
    }
}
