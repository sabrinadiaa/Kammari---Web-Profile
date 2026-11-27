
package com.kammari.web.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    // =========================================
    // PASSWORD ENCODER
    // =========================================

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================
    // USER DETAILS SERVICE
    // =========================================

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

    // =========================================
    // CORS CONFIGURATION
    // =========================================

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Izinkan Front-End localhost
        configuration.setAllowedOrigins(List.of(
                "http://localhost",
                "http://127.0.0.1"
        ));

        // API menu hanya membutuhkan GET
        configuration.setAllowedMethods(List.of(
                "GET",
                "OPTIONS"
        ));

        // Izinkan header permintaan
        configuration.setAllowedHeaders(List.of("*"));

        // API menu publik tidak membutuhkan cookie lintas origin
        configuration.setAllowCredentials(false);

        // Cache hasil preflight selama 1 jam
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // Terapkan khusus endpoint menu
        source.registerCorsConfiguration(
                "/api/menu",
                configuration
        );

        return source;
    }

    // =========================================
    // SECURITY FILTER CHAIN
    // =========================================

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        return http

                // Aktifkan CORS
                .cors(Customizer.withDefaults())

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

                        // Izinkan preflight untuk API menu
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/api/menu"
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
