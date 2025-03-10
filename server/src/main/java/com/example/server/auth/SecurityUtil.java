package com.example.server.auth;

import java.util.Optional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

import com.example.server.users.User;
import com.example.server.utils.exception.ApiException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SecurityUtil {

    public static final SecurityContextRepository securityContextRepository
            = new HttpSessionSecurityContextRepository();

    /**
     * Get the authentificated user from the SecurityContextHolder
     *
     * @throw {@link com.example.server.utils.exception.ApiException} if the
     * user is not found in the SecurityContextHolder
     */
    public static User getAuthentificatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return user;
        } else {
            log.error("User requested but not found in SecurityContextHolder");
            throw ApiException.builder()
                    .status(401)
                    .message("Authentification required")
                    .build();
        }
    }

    public static Optional<User> getOptionalAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof User user) {
            return Optional.of(user);
        } else {
            return Optional.empty();
        }
    }
}
