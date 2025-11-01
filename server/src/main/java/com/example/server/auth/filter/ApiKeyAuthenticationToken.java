package com.example.server.auth.filter;

import java.util.Collection;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import lombok.Getter;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {

    @Getter
    private final String agentId;

    @Getter
    private final String computerId;

    public ApiKeyAuthenticationToken(String agentId, String computerId, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.agentId = agentId;
        this.computerId = computerId;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return "N/A";
    }

    @Override
    public Object getPrincipal() {
        return agentId;
    }
}
