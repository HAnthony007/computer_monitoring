package com.example.server.auth;

import static org.springframework.security.web.util.matcher.AntPathRequestMatcher.antMatcher;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.server.agents.repository.AgentRepository;
import com.example.server.auth.filter.ApiKeyAuthFilter;
import com.example.server.config.ApplicationProperties;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Configuration(proxyBeanMethods = false)
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final ApplicationProperties applicationProperties;
    private final UserDetailsService userDetailsService;
    private final AgentRepository agentRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(customizer -> {
            customizer
                    .requestMatchers(antMatcher(HttpMethod.GET, "/api/users")).permitAll()
                    .requestMatchers(antMatcher(HttpMethod.POST, "/api/users")).permitAll()
                    .requestMatchers(antMatcher(HttpMethod.GET, "/api/hello")).permitAll()
                    .requestMatchers(antMatcher(HttpMethod.POST, "/api/auth/login")).permitAll()
            // H2 console (dev only)
            .requestMatchers(antMatcher("/h2-console/**")).permitAll()
            .requestMatchers(antMatcher(HttpMethod.GET, "/api/monitoring/**")).permitAll()
            .requestMatchers(antMatcher(HttpMethod.POST, "/api/monitoring/**")).permitAll()
            .requestMatchers(antMatcher(HttpMethod.POST, "/api/agent/register")).permitAll()
                    .anyRequest().authenticated();
        });

        http.exceptionHandling(customizer -> {
            customizer.authenticationEntryPoint(
                    (request, response, authException) -> response.sendError(401, "Unauthorized")
            );
        });

    http.addFilterBefore(apiKeyAuthFilter(), UsernamePasswordAuthenticationFilter.class);
        http.userDetailsService(userDetailsService);

        http.csrf(csrf -> {
            csrf.disable();
        });

        http.cors(cors -> {
            cors.configurationSource(corsConfigurationSource());
        });

        // Allow H2 console to be embedded in a frame (needed by H2 UI)
        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public ApiKeyAuthFilter apiKeyAuthFilter() {
        return new ApiKeyAuthFilter(agentRepository, passwordEncoder());
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(@NonNull HttpServletRequest request) {
                CorsConfiguration corsConfiguration = new CorsConfiguration();
                corsConfiguration.setAllowedOrigins(applicationProperties.getAllowedOrigins());
                corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                corsConfiguration.setAllowedHeaders(List.of("*"));
                corsConfiguration.setAllowCredentials(true);
                return corsConfiguration;
            }
        };
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(daoAuthenticationProvider);
    }

}
