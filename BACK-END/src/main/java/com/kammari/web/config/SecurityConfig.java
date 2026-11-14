package com.kammari.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    UserDetailsService ownerDetails(JdbcTemplate jdbc) {
        return email -> jdbc.query("""
                SELECT email, password_hash
                FROM users
                WHERE email = ?
                LIMIT 1
                """,
                (row, rowNumber) -> User.withUsername(row.getString("email"))
                        .password(row.getString("password_hash"))
                        .roles("OWNER")
                        .build(),
                email
        ).stream().findFirst()
                .orElseThrow(() -> new UsernameNotFoundException("Akun tidak ditemukan"));
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/owner/login.html", "/owner/css/**",
                                "/owner/js/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/csrf",
                                "/api/menu", "/api/events", "/api/facilities",
                                "/api/branches").permitAll()
                        .requestMatchers("/api/owner/**", "/owner/**").hasRole("OWNER")
                        .requestMatchers("/api/**").denyAll()
                        .anyRequest().permitAll())
                .exceptionHandling(errors -> errors.defaultAuthenticationEntryPointFor(
                        new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
                        request -> request.getServletPath().startsWith("/api/")))
                .formLogin(form -> form
                        .loginPage("/owner/login.html")
                        .loginProcessingUrl("/api/auth/login")
                        .usernameParameter("email")
                        .successHandler((request, response, authentication) ->
                                response.setStatus(204))
                        .failureHandler((request, response, exception) ->
                                response.setStatus(401))
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) ->
                                response.setStatus(204)))
                .build();
    }
}