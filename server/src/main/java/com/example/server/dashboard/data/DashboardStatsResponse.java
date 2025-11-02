package com.example.server.dashboard.data;

import com.example.server.utils.Client;

import lombok.Data;

@Data
@Client
public class DashboardStatsResponse {
    private long totalComputers;
    private long activeComputers;
    private long inactiveComputers;
    private long totalAgents;
    private long activeAgents;
    private Double averageUptime;
    private Double availabilityRate;
}
