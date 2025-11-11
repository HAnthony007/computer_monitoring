package com.example.server.computers;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "computers")
public class Computer {

    @Id
    @Column(name = "id_computer")
    private String idComputer;

    private String hostname;
    private String ipAdress;
    private String os;
    /**
     * Optional stable fingerprint to uniquely identify a computer across networks.
     * Example: primary MAC address or agent-generated UUID. When present it should be unique.
     */
    @Column(unique = true, nullable = true)
    private String fingerprint;

    public void generateId() {
        this.idComputer = hostname.toLowerCase() + "_" + UUID.randomUUID().toString().replace("-", "").substring(8);
    }
}
