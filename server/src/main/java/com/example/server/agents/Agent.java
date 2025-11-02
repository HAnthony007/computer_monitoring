package com.example.server.agents;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "agents")
@Getter
@Setter
@NoArgsConstructor
public class Agent {

    @Id
    @Column(name = "id_agent")
    private String idAgent;

    @Column(name = "id_computer", nullable = false)
    private String idComputer;

    @Column(name = "api_key_hash", nullable = false)
    private String apiKeyHash;

    @Column(name = "status", nullable = false)
    private String status = "UNKNOWN"; // ONLINE, OFFLINE, UNKNOWN

    @Column(name = "version")
    private String version;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "uptime_seconds")
    private Long uptimeSeconds;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public void generateId() {
        this.idAgent = "agent_" + UUID.randomUUID().toString().replace("-", "").substring(8);
    }
}
