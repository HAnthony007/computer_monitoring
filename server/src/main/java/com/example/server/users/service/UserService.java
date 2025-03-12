package com.example.server.users.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.auth.SecurityUtil;
import com.example.server.users.User;
import com.example.server.users.data.CreateUserRequest;
import com.example.server.users.data.UpdateUserPasswordRequest;
import com.example.server.users.data.UpdateUserRequest;
import com.example.server.users.data.UserResponse;
import com.example.server.users.repository.UserRepository;
import com.example.server.utils.exception.ApiException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(@Valid CreateUserRequest request) {
        User user = new User(request);
        user.generateId();
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Transactional
    public UserResponse updateUser(UpdateUserRequest request) {
        User user = SecurityUtil.getAuthentificatedUser();
        user = userRepository.getReferenceById(user.getIdUser());
        user.update(request);
        user = userRepository.save(user);
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse updatePassword(UpdateUserPasswordRequest request) {
        User user = SecurityUtil.getAuthentificatedUser();
        if (user.getPassword() != null && !passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw ApiException.builder().status(400).message("Wrong password").build();
        }
        user.updatePassword(request.getPassword());
        user = userRepository.save(user);
        return new UserResponse(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

}
// public User updateUser(String id, User userDetails) {
//     return userRepository.findById(id)
//             .map(user -> {
//                 user.setUsername(userDetails.getUsername());
//                 user.setEmail(userDetails.getEmail());
//                 user.setRole(userDetails.getRole());
//                 return userRepository.save(user);
//             })
//             .orElse(null);
    // }
