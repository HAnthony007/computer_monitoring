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
    // Optional stable machine fingerprint (e.g., MAC-based). When provided, the server will
    // use it to uniquely identify the computer instead of the (unreliable) IP address.
    private String fingerprint;
    private String agentVersion;
}
