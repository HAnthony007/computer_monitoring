package com.example.server.users;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.server.users.data.CreateUserRequest;
import com.example.server.users.data.UpdateUserRequest;
import com.example.server.utils.ApplicationContextProvider;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @Column(name = "id_user")
    private String idUser;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public void generateId() {
        this.idUser = role.name().toLowerCase() + "_" + UUID.randomUUID().toString().replace("-", "").substring(8);
    }

    public User(CreateUserRequest request) {
        PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
        this.registrationNumber = request.getRegistrationNumber();
        this.username = request.getUsername();
        this.email = request.getEmail();
        this.password = passwordEncoder.encode(request.getPassword()); // Password should ideally be encoded here
        this.role = request.getRole() != null ? request.getRole() : Role.EMPLOYE;
        generateId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    public void update(UpdateUserRequest request) {
        this.username = request.getUsername();
        this.email = request.getEmail();
        this.registrationNumber = request.getRegistrationNumber();
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
