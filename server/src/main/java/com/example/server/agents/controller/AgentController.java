package com.example.server.agents.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.agents.data.AgentCommandResponse;
import com.example.server.agents.data.HeartbeatRequest;
import com.example.server.agents.data.RegisterAgentRequest;
import com.example.server.agents.data.RegisterAgentResponse;
import com.example.server.agents.service.AgentCommandsService;
import com.example.server.agents.service.AgentService;
import com.example.server.auth.filter.ApiKeyAuthenticationToken;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/agent")
@Validated
public class AgentController {

    private final AgentService agentService;
    private final AgentCommandsService agentCommandsService;

    @PostMapping("/register")
    public ResponseEntity<RegisterAgentResponse> register(@Valid @RequestBody RegisterAgentRequest request) {
        return ResponseEntity.ok(agentService.register(request));
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<Void> heartbeat(@RequestBody(required = false) HeartbeatRequest request,
            org.springframework.security.core.Authentication authentication) {
        ApiKeyAuthenticationToken token = (ApiKeyAuthenticationToken) authentication;
        agentService.heartbeat(token.getAgentId(), request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/commands/poll")
    public ResponseEntity<java.util.List<AgentCommandResponse>> pollCommands(
            org.springframework.security.core.Authentication authentication) {
        ApiKeyAuthenticationToken token = (ApiKeyAuthenticationToken) authentication;
        var cmds = agentCommandsService.pollPendingForComputer(token.getComputerId(), 50)
            .stream()
            .map(c -> new AgentCommandResponse(c.id(), c.type(), c.pid()))
            .toList();
        return ResponseEntity.ok(cmds);
    }
}
