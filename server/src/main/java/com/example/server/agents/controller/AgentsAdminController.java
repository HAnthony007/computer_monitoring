package com.example.server.agents.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.agents.data.AgentResponse;
import com.example.server.agents.service.AgentAdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/agents")
public class AgentsAdminController {

    private final AgentAdminService agentAdminService;

    @GetMapping
    public ResponseEntity<List<AgentResponse>> list() {
        return ResponseEntity.ok(agentAdminService.listAgents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgentResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(agentAdminService.getById(id));
    }

    @PostMapping("/{id}/regenerate-key")
    public ResponseEntity<?> regenerate(@PathVariable String id) {
        String apiKey = agentAdminService.regenerateKey(id);
        return ResponseEntity.ok(java.util.Map.of("apiKey", apiKey));
    }
}
