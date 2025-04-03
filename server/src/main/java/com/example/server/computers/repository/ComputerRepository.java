package com.example.server.computers.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.server.computers.Computer;

public interface ComputerRepository extends JpaRepository<Computer, String> {

    Computer findByHostname(String hostname);

    Computer findByIpAdress(String ipAddress);

}
