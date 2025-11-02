package com.example.server.dashboard.data;

import java.time.LocalDateTime;

import com.example.server.utils.Client;

import lombok.Data;

@Data
@Client
public class ComputerSummaryResponse {
    private String idComputer;
    private String hostname;
    private String ipAddress;
    private String status; // ONLINE | OFFLINE | UNKNOWN
    private LocalDateTime lastSeen;
    private Double latestCpuUsage;
    private Double latestMemoryUsage;
}
