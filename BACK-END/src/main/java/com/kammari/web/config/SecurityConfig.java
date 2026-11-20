package com.kammari.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

@Configuration
public class SecurityConfig {

    // Password menggunakan BCrypt
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Mengambil akun dari database Kammari
    @Bean
    UserDetailsService ownerDetails(JdbcTemplate jdbc) {

        return email -> jdbc.query("""

                SELECT email, password AS password_hash, role
                FROM users
                WHERE email = ?
                LIMIT 1

                """,

                (row, rowNumber) -> User
                        .withUsername(row.getString("email"))
                        .password(row.getString("password_hash"))
                        .roles(row.getString("role"))
                        .build(),

                email

        ).stream().findFirst()
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Akun tidak ditemukan"
                        )
                );
    }

    // Pengaturan akses website dan Portal Owner
    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        return http

                .authorizeHttpRequests(auth -> auth

                        // Login Owner bisa diakses tanpa sesi
                        .requestMatchers(
                                "/owner/login.html",
                                "/owner/css/**",
                                "/owner/js/**"
                        ).permitAll()

                        // API publik untuk pengunjung
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/auth/csrf",
                                "/api/menu",
                                "/api/events",
                                "/api/facilities",
                                "/api/branches"
                        ).permitAll()

                        // Dashboard dan CRUD hanya untuk Owner
                        .requestMatchers(
                                "/api/owner/**",
                                "/owner/**"
                        ).hasRole("OWNER")

                        // API lain tidak terbuka otomatis
                        .requestMatchers("/api/**").denyAll()

                        // Halaman pengunjung tetap publik
                        .anyRequest().permitAll()
                )

                // Error 401 untuk API yang membutuhkan login
                .exceptionHandling(errors ->
                        errors.defaultAuthenticationEntryPointFor(
                                new HttpStatusEntryPoint(
                                        HttpStatus.UNAUTHORIZED
                                ),
                                request -> request
                                        .getServletPath()
                                        .startsWith("/api/")
                        )
                )

                // Proses login melalui Spring Security
                .formLogin(form -> form

                        .loginPage("/owner/login.html")

                        .loginProcessingUrl("/api/auth/login")

                        .usernameParameter("email")

                        .successHandler(
                                (request, response, authentication) ->
                                        response.setStatus(204)
                        )

                        .failureHandler(
                                (request, response, exception) ->
                                        response.setStatus(401)
                        )

                        .permitAll()
                )

                // Logout dan mengakhiri sesi
                .logout(logout -> logout

                        .logoutUrl("/api/auth/logout")

                        .invalidateHttpSession(true)

                        .clearAuthentication(true)

                        .deleteCookies("JSESSIONID")

                        .logoutSuccessHandler(
                                (request, response, authentication) ->
                                        response.setStatus(204)
                        )
                )

                .build();
    }
}