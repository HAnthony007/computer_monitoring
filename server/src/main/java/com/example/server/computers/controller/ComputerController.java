package com.example.server.computers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.computers.Computer;
import com.example.server.computers.service.ComputerService;

@RestController
@RequestMapping("/api/monitoring/computers")
public class ComputerController {

    @Autowired
    private ComputerService computerService;

    /**
     * Get local information about a computer.
     */
    @GetMapping("/info")
    public Computer getLocalComputerInfo() {
        return computerService.getLocalComputerInfo();
    }
}
