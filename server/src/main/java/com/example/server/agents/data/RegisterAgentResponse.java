package com.example.server.agents.data;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterAgentResponse {
    private String agentId;
    private String computerId;
    private String apiKey; // returned once
}
