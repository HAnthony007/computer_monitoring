package com.example.server.agents.data;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterAgentRequest {
    @NotBlank
    private String hostname;
    @NotBlank
    private String ipAddress;
    @NotBlank
    private String os;
    private String agentVersion;
}
