package com.kammari.web.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/owner/events")
public class OwnerEventController {

    private final JdbcTemplate jdbc;

    private static final Set<String> STATUSES = Set.of(
        "draft",
        "upcoming",
        "ongoing",
        "completed",
        "cancelled"
    );

    public OwnerEventController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record EventRequest(
        Long branchId,
        String title,
        String description,
        LocalDateTime startAt,
        LocalDateTime endAt,
        String poster,
        String video,
        String registrationUrl,
        String status
    ) {}

    // =====================================
    // READ - DAFTAR EVENT
    // =====================================

    @GetMapping
    public List<Map<String, Object>> list(
        @RequestParam(required = false) String branch
    ) {
        String sql = """
            SELECT
                e.id,
                e.branch_id AS branchId,
                b.name AS branchName,
                e.title,
                e.slug,
                e.description,
                e.start_at AS startAt,
                e.end_at AS endAt,
                e.poster,
                e.video,
                e.registration_url AS registrationUrl,
                e.status
            FROM events e
            LEFT JOIN branches b
                ON b.id = e.branch_id
            """;

        if (branch != null && !branch.isBlank()) {
            validateBranchSlug(branch);

            return jdbc.queryForList(
                sql + """
                    WHERE b.slug = ?
                    ORDER BY e.start_at DESC, e.id DESC
                    """,
                branch
            );
        }

        return jdbc.queryForList(
            sql + " ORDER BY e.start_at DESC, e.id DESC"
        );
    }

    // =====================================
    // READ - DETAIL EVENT
    // =====================================

    @GetMapping("/{id}")
    public Map<String, Object> detail(
        @PathVariable long id
    ) {
        validateId(id);

        return jdbc.query("""
            SELECT
                id,
                branch_id,
                title,
                slug,
                description,
                start_at,
                end_at,
                poster,
                video,
                registration_url,
                status
            FROM events
            WHERE id = ?
            """,
            rs -> {
                if (!rs.next()) {
                    throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Event tidak ditemukan"
                    );
                }

                Map<String, Object> event =
                    new LinkedHashMap<>();

                event.put("id", rs.getLong("id"));
                event.put(
                    "branchId",
                    rs.getObject("branch_id")
                );
                event.put(
                    "title",
                    rs.getString("title")
                );
                event.put(
                    "slug",
                    rs.getString("slug")
                );
                event.put(
                    "description",
                    rs.getString("description")
                );
                event.put(
                    "startAt",
                    rs.getTimestamp("start_at")
                );
                event.put(
                    "endAt",
                    rs.getTimestamp("end_at")
                );
                event.put(
                    "poster",
                    rs.getString("poster")
                );
                event.put(
                    "video",
                    rs.getString("video")
                );
                event.put(
                    "registrationUrl",
                    rs.getString("registration_url")
                );
                event.put(
                    "status",
                    rs.getString("status")
                );

                return event;
            },
            id
        );
    }

    // =====================================
    // CREATE - TAMBAH EVENT
    // =====================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Map<String, String> create(
        @RequestBody EventRequest request
    ) {
        validate(request);

        String title = request.title().trim();
        String slug = createSlug(title);

        try {
            jdbc.update("""
                INSERT INTO events (
                    branch_id,
                    title,
                    slug,
                    description,
                    start_at,
                    end_at,
                    poster,
                    video,
                    registration_url,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                request.branchId(),
                title,
                slug,
                clean(request.description()),
                Timestamp.valueOf(request.startAt()),
                Timestamp.valueOf(request.endAt()),
                clean(request.poster()),
                clean(request.video()),
                clean(request.registrationUrl()),
                effectiveStatus(request.status())
            );

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Judul atau slug event sudah digunakan",
                exception
            );
        }

        return Map.of(
            "message", "Event berhasil ditambahkan",
            "title", title,
            "slug", slug
        );
    }

    // =====================================
    // UPDATE - EDIT EVENT
    // =====================================

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void update(
        @PathVariable long id,
        @RequestBody EventRequest request
    ) {
        validateId(id);
        validate(request);

        String title = request.title().trim();
        String slug = createSlug(title);

        try {
            int updated = jdbc.update("""
                UPDATE events
                SET
                    branch_id = ?,
                    title = ?,
                    slug = ?,
                    description = ?,
                    start_at = ?,
                    end_at = ?,
                    poster = ?,
                    video = ?,
                    registration_url = ?,
                    status = ?
                WHERE id = ?
                """,
                request.branchId(),
                title,
                slug,
                clean(request.description()),
                Timestamp.valueOf(request.startAt()),
                Timestamp.valueOf(request.endAt()),
                clean(request.poster()),
                clean(request.video()),
                clean(request.registrationUrl()),
                effectiveStatus(request.status()),
                id
            );

            if (updated == 0 && !exists(id)) {
                throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Event tidak ditemukan"
                );
            }

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Judul atau slug event sudah digunakan",
                exception
            );
        }
    }

    // =====================================
    // DELETE - BATALKAN EVENT
    // =====================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void cancel(
        @PathVariable long id
    ) {
        validateId(id);

        if (!exists(id)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Event tidak ditemukan"
            );
        }

        jdbc.update("""
            UPDATE events
            SET status = 'cancelled'
            WHERE id = ?
            """,
            id
        );
    }

    // =====================================
    // VALIDASI DATA EVENT
    // =====================================

    private void validate(EventRequest request) {
        if (request == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Data event wajib diisi"
            );
        }

        String title = request.title() == null
            ? ""
            : request.title().trim();

        if (title.isBlank() || title.length() > 255) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Judul event wajib diisi, maksimal 255 karakter"
            );
        }

        String slug = createSlug(title);

        if (slug.isBlank() || slug.length() > 255) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Judul menghasilkan slug tidak valid"
            );
        }

        if (request.startAt() == null ||
            request.endAt() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Tanggal mulai dan selesai wajib diisi"
            );
        }

        if (!request.endAt().isAfter(request.startAt())) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Waktu selesai harus setelah waktu mulai"
            );
        }

        if (request.branchId() != null) {
            Integer count = jdbc.queryForObject("""
                SELECT COUNT(*)
                FROM branches
                WHERE id = ? AND is_active = 1
                """,
                Integer.class,
                request.branchId()
            );

            if (count == null || count == 0) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cabang tidak valid"
                );
            }
        }

        checkLength(request.poster(), 500, "Poster");
        checkLength(request.video(), 500, "Video");
        checkLength(
            request.registrationUrl(),
            1000,
            "Link pendaftaran"
        );

        String registrationUrl =
            clean(request.registrationUrl());

        if (registrationUrl != null &&
            !registrationUrl.matches("(?i)^https?://[^\\s]+$")) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Link pendaftaran harus menggunakan HTTP atau HTTPS"
            );
        }

        effectiveStatus(request.status());
    }

    private static String effectiveStatus(String status) {
        String value = status == null
            ? "draft"
            : status.trim().toLowerCase();

        if (!STATUSES.contains(value)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Status event tidak valid"
            );
        }

        return value;
    }

    private static void checkLength(
        String value,
        int max,
        String field
    ) {
        if (value != null && value.trim().length() > max) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                field + " terlalu panjang"
            );
        }
    }

    private boolean exists(long id) {
        Integer count = jdbc.queryForObject("""
            SELECT COUNT(*)
            FROM events
            WHERE id = ?
            """,
            Integer.class,
            id
        );

        return count != null && count > 0;
    }

    private static void validateId(long id) {
        if (id <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "ID tidak valid"
            );
        }
    }

    private static void validateBranchSlug(String branch) {
        if (!"gresik".equals(branch) &&
            !"surabaya".equals(branch)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cabang tidak valid"
            );
        }
    }

    private static String clean(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim();
    }

    private static String createSlug(String title) {
        String normalized = java.text.Normalizer.normalize(
            title.toLowerCase(java.util.Locale.ROOT),
            java.text.Normalizer.Form.NFD
        );

        return normalized
            .replaceAll("\\p{M}", "")
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");
    }
}
