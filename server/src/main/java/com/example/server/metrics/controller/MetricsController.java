package com.example.server.metrics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.auth.filter.ApiKeyAuthenticationToken;
import com.example.server.metrics.data.MetricsBatchRequest;
import com.example.server.metrics.service.MetricsIngestService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/metrics")
@Validated
public class MetricsController {

    private final MetricsIngestService metricsIngestService;

    @PostMapping("/batch")
    public ResponseEntity<Void> ingest(@Valid @RequestBody MetricsBatchRequest request,
            org.springframework.security.core.Authentication authentication) {
        ApiKeyAuthenticationToken token = (ApiKeyAuthenticationToken) authentication;
        metricsIngestService.ingest(token.getComputerId(), request);
        return ResponseEntity.accepted().build();
    }
}
