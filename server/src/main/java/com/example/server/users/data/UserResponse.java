package com.example.server.users.data;

import com.example.server.users.Role;
import com.example.server.users.User;
import com.example.server.utils.Client;

import lombok.Data;

@Data
@Client
public class UserResponse {

    private String registrationNumber;
    private String username;
    private String email;
    private Role role;

    public UserResponse(User user) {
        this.registrationNumber = user.getRegistrationNumber();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.role = user.getRole();
    }
}
