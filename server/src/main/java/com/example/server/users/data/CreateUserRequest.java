package com.example.server.users.data;

import org.hibernate.validator.constraints.Length;

import com.example.server.users.Role;
import com.example.server.utils.Client;
import com.example.server.utils.validator.PasswordMatch;
import com.example.server.utils.validator.Unique;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;

@Data
@PasswordMatch(passwordField = "password", passwordConfirmationField = "passwordMatch")
@Builder
@Client
public class CreateUserRequest {

    @NotNull
    @Unique(tableName = "users", columnName = "registration_number", message = "Registration number already exists")
    private String registrationNumber;

    @NotNull
    private String username;

    @NotNull
    @Email
    @Unique(tableName = "users", columnName = "email", message = "Email already exists")
    private String email;

    @NotNull
    @Length(min = 8)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$", message = "must contain at least one uppercase letter, one lowercase letter, and one digit.")
    private String password;
    private String passwordConfirmation;

    private Role role;
}
