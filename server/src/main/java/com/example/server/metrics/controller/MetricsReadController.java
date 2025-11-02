package com.example.server.metrics.controller;

import java.time.Instant;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.metrics.data.MetricsReadModels.LatestMetricsResponse;
import com.example.server.metrics.data.MetricsReadModels.MetricsHistoryResponse;
import com.example.server.metrics.service.MetricsReadService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/computers/{computerId}/metrics")
public class MetricsReadController {

    private final MetricsReadService metricsReadService;

    @GetMapping("/latest")
    public ResponseEntity<LatestMetricsResponse> latest(@PathVariable String computerId) {
        return ResponseEntity.ok(metricsReadService.latest(computerId));
    }

    @GetMapping
    public ResponseEntity<MetricsHistoryResponse> history(
            @PathVariable String computerId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(required = false, defaultValue = "50") int limit,
            @RequestParam(required = false, defaultValue = "0") int offset
    ) {
        return ResponseEntity.ok(metricsReadService.history(computerId, type, from, to, limit, offset));
    }
}
