package com.example.server.agents.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.agents.Agent;
import com.example.server.agents.data.HeartbeatRequest;
import com.example.server.agents.data.RegisterAgentRequest;
import com.example.server.agents.data.RegisterAgentResponse;
import com.example.server.agents.repository.AgentRepository;
import com.example.server.computers.Computer;
import com.example.server.computers.repository.ComputerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;
    private final ComputerRepository computerRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public RegisterAgentResponse register(RegisterAgentRequest request) {
        // Find or create computer by IP address
        Computer computer = computerRepository.findByIpAdress(request.getIpAddress());
        if (computer == null) {
            computer = new Computer();
            computer.setHostname(request.getHostname());
            computer.setIpAdress(request.getIpAddress());
            computer.setOs(request.getOs());
            computer.generateId();
            computer = computerRepository.save(computer);
        }

        // Idempotent registration: if an agent already exists for this computer,
        // rotate the secret and return a fresh apiKey; otherwise create a new agent.
        final String compId = computer.getIdComputer();
        return agentRepository.findByIdComputer(compId)
                .map(existing -> {
                    String newSecret = UUID.randomUUID().toString().replace("-", "");
                    existing.setApiKeyHash(passwordEncoder.encode(newSecret));
                    existing.setStatus("ONLINE");
                    existing.setVersion(request.getAgentVersion());
                    existing.setLastSeen(LocalDateTime.now());
                    Agent saved = agentRepository.save(existing);
                    String apiKey = saved.getIdAgent() + "." + newSecret;
                    return new RegisterAgentResponse(saved.getIdAgent(), compId, apiKey);
                })
                .orElseGet(() -> {
                    String secret = UUID.randomUUID().toString().replace("-", "");
                    Agent agent = new Agent();
                    agent.generateId();
                    agent.setIdComputer(compId);
                    agent.setApiKeyHash(passwordEncoder.encode(secret));
                    agent.setStatus("ONLINE");
                    agent.setVersion(request.getAgentVersion());
                    agent.setLastSeen(LocalDateTime.now());
                    agent = agentRepository.save(agent);
                    String apiKey = agent.getIdAgent() + "." + secret;
                    return new RegisterAgentResponse(agent.getIdAgent(), compId, apiKey);
                });
    }

    @Transactional
    public void heartbeat(String agentId, HeartbeatRequest req) {
        Agent agent = agentRepository.findById(agentId).orElseThrow();
        agent.setStatus("ONLINE");
        if (req != null) {
            if (req.getAgentVersion() != null) {
                agent.setVersion(req.getAgentVersion());
            }
            if (req.getUptimeSeconds() != null) {
                agent.setUptimeSeconds(req.getUptimeSeconds());
            }
        }
        agent.setLastSeen(LocalDateTime.now());
        agentRepository.save(agent);
    }
}
