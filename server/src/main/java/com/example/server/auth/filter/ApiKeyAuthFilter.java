package com.example.server.auth.filter;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.server.agents.Agent;
import com.example.server.agents.repository.AgentRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // Filter only agent and metrics ingestion endpoints (X-API-Key auth)
        // - Agent heartbeat
        // - Agent commands (poll)
        // - Metrics ingestion
        boolean shouldFilter = path.startsWith("/api/agent/heartbeat")
                || path.startsWith("/api/agent/commands/")
                || path.startsWith("/api/metrics/");
        return !shouldFilter;
    }

    @Override
    protected void doFilterInternal(@org.springframework.lang.NonNull HttpServletRequest request,
        @org.springframework.lang.NonNull HttpServletResponse response,
        @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String apiKey = request.getHeader("X-API-Key");
        if (!StringUtils.hasText(apiKey) || !apiKey.contains(".")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid API key");
            return;
        }

        String[] parts = apiKey.split("\\.", 2);
        String apiKeyId = parts[0]; // we'll use idAgent as id
        String secret = parts[1];

        Agent agent = agentRepository.findByIdAgent(apiKeyId).orElse(null);
        if (agent == null || !passwordEncoder.matches(secret, agent.getApiKeyHash())) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid API key");
            return;
        }

        var auth = new ApiKeyAuthenticationToken(agent.getIdAgent(), agent.getIdComputer(), Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(auth);
        filterChain.doFilter(request, response);
    }
}
