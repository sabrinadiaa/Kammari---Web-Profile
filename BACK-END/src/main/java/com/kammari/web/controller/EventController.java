package com.kammari.web.controller;

import java.util.List;
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
public class EventController {

    private static final Logger log = LoggerFactory.getLogger(EventController.class);

    private static final String EVENT_QUERY = """
            SELECT e.id, e.title, e.slug, e.description,
                   e.start_at, e.end_at, e.poster, NULL as video,
                   e.registration_url, e.status,
                   b.name AS branch_name,
                   b.slug AS branch_slug
            FROM events e
            JOIN branches b ON b.id = e.branch_id
            WHERE b.is_active = 1
              AND e.status IN ('upcoming', 'ongoing', 'completed')
            """;

    private static final String ORDER_BY = " ORDER BY e.start_at DESC";

    private final JdbcTemplate jdbc;

    public EventController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/api/events")
    public ResponseEntity<Map<String, Object>> events(
            @RequestParam(name = "branch", defaultValue = "") String branch) {
        try {
            List<Map<String, Object>> events;

            if (branch.isEmpty()) {
                events = jdbc.queryForList(EVENT_QUERY + ORDER_BY);
            } else {
                events = jdbc.queryForList(
                        EVENT_QUERY + " AND b.slug = ?" + ORDER_BY, branch);
            }

            return ResponseEntity.ok(Map.of("events", events));
        } catch (DataAccessException exception) {
            log.error("Gagal mengambil data event dari database", exception);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Gagal mengambil data event"));
        }
    }
}