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

    public void generateId() {
        this.idComputer = hostname.toLowerCase() + "_" + UUID.randomUUID().toString().replace("-", "").substring(8);
    }
}
