package com.example.server.users.data;

import com.example.server.users.Role;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateUserRequest {
    
    private String registrationNumber;
    private String username;
    private String email;
    private String password;
    private Role role;
}
