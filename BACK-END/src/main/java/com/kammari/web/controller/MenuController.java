package com.kammari.web.controller;

import java.util.Map;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MenuController {

    private static final Set<String> ALLOWED_BRANCHES = Set.of("gresik", "surabaya");

    private final JdbcTemplate jdbc;

    public MenuController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/api/menu")
    public ResponseEntity<Map<String, Object>> menu(
            @RequestParam(name = "branch", defaultValue = "gresik") String branch) {
        if (!ALLOWED_BRANCHES.contains(branch)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cabang tidak valid."));
        }

        var items = jdbc.queryForList("""
                SELECT m.id, m.name, m.slug, m.description, m.price, m.image,
                       m.is_available, m.is_recommended,
                       c.slug AS category_slug,
                       c.name AS category_name,
                       c.description AS category_description
                FROM branch_menu_items AS m
                JOIN branches AS b ON b.id = m.branch_id
                JOIN menu_categories AS c ON c.id = m.category_id
                WHERE b.slug = ?
                  AND b.is_active = 1
                  AND m.is_active = 1
                  AND c.is_active = 1
                ORDER BY c.sort_order, m.sort_order, m.id
                """, branch);

        return ResponseEntity.ok(Map.of("branch", branch, "items", items));
    }
}