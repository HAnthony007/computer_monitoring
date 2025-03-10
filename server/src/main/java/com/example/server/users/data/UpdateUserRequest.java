package com.example.server.users.data;

import com.example.server.utils.Client;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Client
public class UpdateUserRequest {

    @NotBlank
    private String username;
    @NotBlank
    private String email;
    @NotBlank
    private String registrationNumber;
}
