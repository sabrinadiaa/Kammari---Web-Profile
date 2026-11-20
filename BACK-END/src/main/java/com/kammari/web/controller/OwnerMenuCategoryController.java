
package com.kammari.web.controller;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner/menu-categories")
public class OwnerMenuCategoryController {

    private final JdbcTemplate jdbc;

    public OwnerMenuCategoryController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    public List<Map<String, Object>> getCategories() {

        return jdbc.queryForList("""
            SELECT
                id,
                name
            FROM menu_categories
            WHERE is_active = 1
            ORDER BY sort_order ASC, id ASC
            """);
    }
}
