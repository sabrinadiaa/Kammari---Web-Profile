
package com.kammari.web.controller;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/owner/facility-management")
public class OwnerFacilityManageController {

    private final JdbcTemplate jdbc;

    private static final Set<String> TYPES =
        Set.of("facility", "highlight");

    public OwnerFacilityManageController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record FacilityRequest(
        Long branchId,
        String name,
        String description,
        String image,
        String icon,
        String type,
        Boolean isAvailable,
        Integer sortOrder
    ) {}

    // =====================================
    // GET - DAFTAR FASILITAS
    // =====================================

    @GetMapping
    public List<Map<String, Object>> list(
        @RequestParam(required = false) String branch
    ) {
        String sql = """
            SELECT
                f.id,
                f.branch_id,
                b.name AS branch_name,
                f.name,
                f.description,
                f.image,
                f.icon,
                f.type,
                f.is_available,
                f.sort_order
            FROM branch_facilities f
            JOIN branches b ON b.id = f.branch_id
            """;

        String order = """
            ORDER BY b.id, f.sort_order, f.id
            """;

        if (branch != null && !branch.isBlank()) {
            if (!Set.of("gresik", "surabaya").contains(branch)) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cabang tidak valid"
                );
            }

            return jdbc.query(
                sql + " WHERE b.slug = ? " + order,
                (rs, rowNum) -> mapFacility(rs),
                branch
            );
        }

        return jdbc.query(
            sql + order,
            (rs, rowNum) -> mapFacility(rs)
        );
    }

    // =====================================
    // GET - DETAIL FASILITAS
    // =====================================

    @GetMapping("/{id}")
    public Map<String, Object> detail(
        @PathVariable long id
    ) {
        validateId(id);

        List<Map<String, Object>> result = jdbc.query("""
            SELECT
                f.id,
                f.branch_id,
                b.name AS branch_name,
                f.name,
                f.description,
                f.image,
                f.icon,
                f.type,
                f.is_available,
                f.sort_order
            FROM branch_facilities f
            JOIN branches b ON b.id = f.branch_id
            WHERE f.id = ?
            """,
            (rs, rowNum) -> mapFacility(rs),
            id
        );

        if (result.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Fasilitas tidak ditemukan"
            );
        }

        return result.get(0);
    }

    // =====================================
    // POST - TAMBAH FASILITAS
    // =====================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Map<String, Object> create(
        @RequestBody FacilityRequest request
    ) {
        validate(request);

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                """
                INSERT INTO branch_facilities (
                    branch_id,
                    name,
                    description,
                    image,
                    icon,
                    type,
                    is_available,
                    sort_order
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                Statement.RETURN_GENERATED_KEYS
            );

            ps.setLong(1, request.branchId());
            ps.setString(2, request.name().trim());
            ps.setString(3, clean(request.description()));
            ps.setString(4, clean(request.image()));
            ps.setString(5, clean(request.icon()));
            ps.setString(6, normalizedType(request.type()));
            ps.setBoolean(
                7,
                request.isAvailable() == null
                    || request.isAvailable()
            );
            ps.setInt(
                8,
                request.sortOrder() == null
                    ? 0
                    : request.sortOrder()
            );

            return ps;
        }, keyHolder);

        Number id = keyHolder.getKey();

        if (id == null) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "ID fasilitas tidak ditemukan"
            );
        }

        return Map.of(
            "message", "Fasilitas berhasil ditambahkan",
            "id", id.longValue()
        );
    }

    // =====================================
    // PUT - EDIT FASILITAS
    // =====================================

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void update(
        @PathVariable long id,
        @RequestBody FacilityRequest request
    ) {
        validateId(id);
        validate(request);

        // Pastikan ID ada, termasuk jika nilai
        // baru ternyata sama dengan nilai lama.
        detail(id);

        jdbc.update("""
            UPDATE branch_facilities
            SET
                branch_id = ?,
                name = ?,
                description = ?,
                image = ?,
                icon = ?,
                type = ?,
                is_available = ?,
                sort_order = ?
            WHERE id = ?
            """,
            request.branchId(),
            request.name().trim(),
            clean(request.description()),
            clean(request.image()),
            clean(request.icon()),
            normalizedType(request.type()),
            request.isAvailable() == null
                || request.isAvailable(),
            request.sortOrder() == null
                ? 0
                : request.sortOrder(),
            id
        );
    }

    // =====================================
    // DELETE - HAPUS FASILITAS
    // =====================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(
        @PathVariable long id
    ) {
        validateId(id);

        int deleted = jdbc.update("""
            DELETE FROM branch_facilities
            WHERE id = ?
            """,
            id
        );

        if (deleted == 0) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Fasilitas tidak ditemukan"
            );
        }
    }

    // =====================================
    // VALIDASI
    // =====================================

    private void validate(FacilityRequest request) {
        if (request == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Data fasilitas wajib diisi"
            );
        }

        String name = clean(request.name());

        if (name == null || name.length() > 200) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Nama fasilitas wajib diisi (maks. 200 karakter)"
            );
        }

        if (request.branchId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cabang wajib dipilih"
            );
        }

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
                "Cabang tidak ditemukan"
            );
        }

        normalizedType(request.type());

        checkLength(request.description(), 5000, "Deskripsi");
        checkLength(request.image(), 500, "Foto");
        checkLength(request.icon(), 100, "Ikon");

        if (request.sortOrder() != null &&
            request.sortOrder() < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Urutan tidak boleh negatif"
            );
        }
    }

    private static String normalizedType(String type) {
        String value = clean(type);

        if (value == null || !TYPES.contains(value)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Tipe harus facility atau highlight"
            );
        }

        return value;
    }

    private static void validateId(long id) {
        if (id <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "ID tidak valid"
            );
        }
    }

    private static void checkLength(
        String value,
        int max,
        String label
    ) {
        if (value != null && value.trim().length() > max) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                label + " terlalu panjang"
            );
        }
    }

    private static String clean(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private static Map<String, Object> mapFacility(
        java.sql.ResultSet rs
    ) throws java.sql.SQLException {

        Map<String, Object> item =
            new LinkedHashMap<>();

        item.put("id", rs.getLong("id"));
        item.put("branchId", rs.getLong("branch_id"));
        item.put("branchName", rs.getString("branch_name"));
        item.put("name", rs.getString("name"));
        item.put("description", rs.getString("description"));
        item.put("image", rs.getString("image"));
        item.put("icon", rs.getString("icon"));
        item.put("type", rs.getString("type"));
        item.put(
            "isAvailable",
            rs.getBoolean("is_available")
        );
        item.put("sortOrder", rs.getInt("sort_order"));

        return item;
    }
}
