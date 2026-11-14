package com.kammari.web.controller;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BranchController {

    private final JdbcTemplate jdbc;

    public BranchController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/api/branches")
    public Map<String, List<Map<String, Object>>> branches() {
        var branches = jdbc.queryForList("""
                SELECT id, name, slug, address
                FROM branches
                WHERE is_active = 1
                ORDER BY id
                """);

        return Map.of("branches", branches);
    }
}