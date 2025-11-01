package com.example.server.agents.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.server.agents.Agent;

public interface AgentRepository extends JpaRepository<Agent, String> {

    Optional<Agent> findByIdAgent(String idAgent);

    Optional<Agent> findByIdComputer(String idComputer);
}
