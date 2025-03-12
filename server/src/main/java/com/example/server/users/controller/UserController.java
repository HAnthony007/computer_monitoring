package com.example.server.users.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.users.User;
import com.example.server.users.data.CreateUserRequest;
import com.example.server.users.data.UpdateUserPasswordRequest;
import com.example.server.users.data.UpdateUserRequest;
import com.example.server.users.data.UserResponse;
import com.example.server.users.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        UserResponse userResponse = new UserResponse(user);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User userDetails) {
    //     User user = userService.updateUser(id, userDetails);
    //     return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    // }
    /**
     * Update an existing user.
     * <p>
     * Only allowed to self
     *
     * @param id
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UpdateUserRequest request) {
        UserResponse user = userService.updateUser(request);
        return ResponseEntity.ok(user);
    }

    /**
     * Update the password of an existing user.
     * <p>
     * Only allowed with the correct old password
     *
     * @param id
     * @return
     */
    @PatchMapping("/password")
    public ResponseEntity<UserResponse> updatePassword(@Valid @RequestBody UpdateUserPasswordRequest request) {
        UserResponse user = userService.updatePassword(request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
