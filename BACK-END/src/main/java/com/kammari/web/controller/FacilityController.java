package com.kammari.web.controller;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FacilityController {

    private static final Logger log = LoggerFactory.getLogger(FacilityController.class);

    private final JdbcTemplate jdbc;

    public FacilityController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/api/facilities")
    public ResponseEntity<Map<String, Object>> facilities(
            @RequestParam(name = "branch", required = false) String branch) {

        String selectedBranch = branch == null ? "gresik" : branch;

        try {
            var facilities = jdbc.queryForList("""
                SELECT f.id, f.name, f.description, f.image, f.icon,
                    f.type,
                    b.slug AS branch
                FROM branch_facilities AS f
                INNER JOIN branches AS b ON b.id = f.branch_id
                WHERE b.slug = ?
                AND b.is_active = 1
                AND f.is_available = 1
                ORDER BY f.sort_order ASC
                """, selectedBranch);


            return ResponseEntity.ok(Map.of(
                    "branch", selectedBranch,
                    "facilities", facilities
            ));
        } catch (DataAccessException exception) {
            log.error("Gagal mengambil fasilitas dari database", exception);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Gagal mengambil fasilitas"));
        }
    }
}