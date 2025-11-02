package com.example.server.computers.data;

import com.example.server.computers.Computer;
import com.example.server.utils.Client;

import lombok.Data;

@Data
@Client
public class ComputerResponse {
    private String idComputer;
    private String hostname;
    private String ipAddress; // map from ipAdress
    private String os;

    // Optional UI fields
    private String status; // ONLINE, OFFLINE, UNKNOWN
    private java.time.LocalDateTime lastSeen;

    public ComputerResponse() {}

    public ComputerResponse(Computer c) {
        this.idComputer = c.getIdComputer();
        this.hostname = c.getHostname();
        this.ipAddress = c.getIpAdress();
        this.os = c.getOs();
    }
}
