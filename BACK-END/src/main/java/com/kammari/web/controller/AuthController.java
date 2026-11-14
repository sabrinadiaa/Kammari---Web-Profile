package com.kammari.web.controller;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @GetMapping("/api/auth/csrf")
    public ResponseEntity<Map<String, String>> csrf(CsrfToken csrf) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(Map.of(
                        "headerName", csrf.getHeaderName(),
                        "token", csrf.getToken()
                ));
    }

    @GetMapping("/api/owner/me")
    public Map<String, String> currentOwner(Principal owner) {
        return Map.of("email", owner.getName());
    }
}