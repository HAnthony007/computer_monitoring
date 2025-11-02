package com.example.server.computers.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.agents.data.AgentResponse;
import com.example.server.computers.data.ComputerResponse;
import com.example.server.computers.service.ComputersQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/computers")
public class ComputersController {

    private final ComputersQueryService computersQueryService;

    @GetMapping
    public ResponseEntity<List<ComputerResponse>> list() {
        return ResponseEntity.ok(computersQueryService.listComputers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComputerResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(computersQueryService.getById(id));
    }

    @GetMapping("/{id}/agents")
    public ResponseEntity<List<AgentResponse>> agents(@PathVariable("id") String computerId) {
        return ResponseEntity.ok(computersQueryService.listAgentsForComputer(computerId));
    }
}
