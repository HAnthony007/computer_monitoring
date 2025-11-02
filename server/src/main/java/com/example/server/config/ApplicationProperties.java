package com.example.server.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "app")
@Setter
@Getter
public class ApplicationProperties {

    private List<String> allowedOrigins;
    private String baseUrl;
    private String applicationName;
    private String loginPageUrl;

    // Scheduling / agent status tuning
    private Long agentStatusCheckMillis; // how often to check (ms)
    private Long agentOfflineAfterSeconds; // mark OFFLINE if last_seen older than this
}
