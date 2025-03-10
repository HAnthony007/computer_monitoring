package com.example.server.users.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.auth.SecurityUtil;
import com.example.server.users.User;
import com.example.server.users.data.CreateUserRequest;
import com.example.server.users.data.UpdateUserRequest;
import com.example.server.users.data.UserResponse;
import com.example.server.users.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(CreateUserRequest request) {
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
        user = userRepository.getReferenceById(user.getId());
        user.update(request);
        user = userRepository.save(user);
        return new UserResponse(user);
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

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

}
