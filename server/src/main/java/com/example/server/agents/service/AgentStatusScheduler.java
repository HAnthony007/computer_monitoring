package com.example.server.agents.service;

import java.time.LocalDateTime;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.server.config.ApplicationProperties;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Periodically mark agents OFFLINE if they haven't sent a heartbeat recently.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AgentStatusScheduler {

    private final JdbcClient jdbcClient;
    private final ApplicationProperties props;

    // Every 30s check for stale agents; mark as OFFLINE if last_seen older than 90s
    @Scheduled(fixedDelayString = "${app.agentStatusCheckMillis:30000}")
    public void markStaleAgentsOffline() {
        long offlineAfter = props.getAgentOfflineAfterSeconds() != null ? props.getAgentOfflineAfterSeconds() : 90L;
        LocalDateTime cutoff = LocalDateTime.now().minusSeconds(offlineAfter);
        int updated = jdbcClient.sql("UPDATE agents SET status='OFFLINE' WHERE (last_seen IS NULL OR last_seen < ?) AND status <> 'OFFLINE'")
            .param(cutoff)
            .update();
        if (updated > 0) {
            log.info("Marked {} agent(s) OFFLINE (cutoff={}s ago)", updated, offlineAfter);
        }
    }
}
