package com.example.server.dashboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.dashboard.data.ComputerSummaryResponse;
import com.example.server.dashboard.data.DashboardStatsResponse;
import com.example.server.dashboard.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> stats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/computers-summary")
    public ResponseEntity<List<ComputerSummaryResponse>> computersSummary() {
        return ResponseEntity.ok(dashboardService.getComputersSummary());
    }
}
