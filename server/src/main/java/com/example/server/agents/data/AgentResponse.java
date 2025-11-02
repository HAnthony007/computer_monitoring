package com.example.server.agents.data;

import java.time.LocalDateTime;

import com.example.server.agents.Agent;
import com.example.server.utils.Client;

import lombok.Data;

@Data
@Client
public class AgentResponse {
    private String idAgent;
    private String idComputer;
    private String status; // ONLINE, OFFLINE, UNKNOWN
    private String version;
    private LocalDateTime lastSeen;
    private LocalDateTime createdAt;

    public AgentResponse() {}

    public AgentResponse(Agent a) {
        this.idAgent = a.getIdAgent();
        this.idComputer = a.getIdComputer();
        this.status = a.getStatus();
        this.version = a.getVersion();
        this.lastSeen = a.getLastSeen();
        this.createdAt = a.getCreatedAt();
    }
}
