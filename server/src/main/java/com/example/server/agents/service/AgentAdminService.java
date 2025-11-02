package com.example.server.agents.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.agents.Agent;
import com.example.server.agents.data.AgentResponse;
import com.example.server.agents.repository.AgentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgentAdminService {

    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<AgentResponse> listAgents() {
        return agentRepository.findAll().stream().map(AgentResponse::new).toList();
    }

    @Transactional(readOnly = true)
    public AgentResponse getById(String id) {
        Agent a = agentRepository.findById(id).orElseThrow();
        return new AgentResponse(a);
    }

    @Transactional
    public String regenerateKey(String id) {
        Agent a = agentRepository.findById(id).orElseThrow();
        String newSecret = UUID.randomUUID().toString().replace("-", "");
        a.setApiKeyHash(passwordEncoder.encode(newSecret));
        agentRepository.save(a);
        return a.getIdAgent() + "." + newSecret;
    }
}
