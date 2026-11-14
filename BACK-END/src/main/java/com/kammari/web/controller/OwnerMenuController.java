package com.kammari.web.controller;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/owner/menus")
public class OwnerMenuController {

    private final JdbcTemplate jdbc;
    private static final Set<String> BRANCHES = Set.of("gresik", "surabaya");

    public OwnerMenuController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping
    public Map<String, Object> list(@RequestParam("branch") String branch) {
        validateBranch(branch);

        var items = jdbc.queryForList("""
            SELECT m.id, m.name, m.price
            FROM branch_menu_items m
            JOIN branches b ON b.id = m.branch_id
            WHERE b.slug = ? AND m.is_active = 1
            ORDER BY m.sort_order, m.id
            """, branch);

        return Map.of("items", items);
    }

    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updatePrice(
            @PathVariable("id") long id,
            @RequestParam("branch") String branch,
            @RequestBody PriceUpdate request) {

        validateBranch(branch);
        BigDecimal price = request.price();

        if (price == null || price.signum() < 0
                || price.stripTrailingZeros().scale() > 2
                || price.compareTo(new BigDecimal("99999999.99")) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Harga tidak valid");
        }

        int updated = jdbc.update("""
            UPDATE branch_menu_items m
            JOIN branches b ON b.id = m.branch_id
            SET m.price = ?
            WHERE m.id = ? AND b.slug = ? AND m.is_active = 1
            """, price, id, branch);

        if (updated == 0 && !Boolean.TRUE.equals(jdbc.queryForObject("""
            SELECT COUNT(*) > 0
            FROM branch_menu_items m
            JOIN branches b ON b.id = m.branch_id
            WHERE m.id = ? AND b.slug = ? AND m.is_active = 1
            """, Boolean.class, id, branch))) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu tidak ditemukan di cabang ini");
        }
    }

    private static void validateBranch(String branch) {
        if (!BRANCHES.contains(branch)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cabang tidak valid");
        }
    }

    public record PriceUpdate(BigDecimal price) {}
}