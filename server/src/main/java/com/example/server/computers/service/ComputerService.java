package com.example.server.computers.service;

import java.net.InetAddress;
import java.net.UnknownHostException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.computers.Computer;
import com.example.server.computers.repository.ComputerRepository;

@Service
public class ComputerService {

    @Autowired
    private ComputerRepository computerRepository;

    /**
     * Get information local about a computer.
     */
    public Computer getLocalComputerInfo() {
        Computer computer = new Computer();

        try {
            computer.setHostname(InetAddress.getLocalHost().getHostName());
            computer.setIpAdress(InetAddress.getLocalHost().getHostAddress());
            computer.setOs(System.getProperty("os.name") + " "
                    + System.getProperty("os.version") + " ("
                    + System.getProperty("os.arch") + ")");
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return computer;
    }
}
