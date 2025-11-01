package com.example.server.agents.data;

import lombok.Data;

@Data
public class HeartbeatRequest {
    private Long uptimeSeconds;
    private Double loadAvg1m;
    private Double loadAvg5m;
    private Double loadAvg15m;
    private String agentVersion;
}
