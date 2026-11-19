package com.kammari.web.controller;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/owner/menus")
public class OwnerMenuManageController {

    private final JdbcTemplate jdbc;

    public OwnerMenuManageController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // ========================================
    // DATA UNTUK EDIT MENU
    // ========================================

    public record UpdateMenuRequest(
        String name,
        Long categoryId,
        String description,
        BigDecimal price,
        String image,
        Boolean isAvailable,
        Boolean isRecommended
    ) {}

    // ========================================
    // GET DETAIL MENU
    // ========================================

    @GetMapping("/{id}")
    public Map<String, Object> detail(
            @PathVariable long id,
            @RequestParam String branch) {

        validateBranch(branch);

        return jdbc.query("""
            SELECT
                m.id,
                m.name,
                m.category_id,
                m.description,
                m.price,
                m.slug,
                m.image,
                m.is_available,
                m.is_recommended
            FROM branch_menu_items m
            JOIN branches b
                ON b.id = m.branch_id
            WHERE m.id = ?
              AND b.slug = ?
              AND m.is_active = 1
            """,
            rs -> {
                if (!rs.next()) {
                    throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Menu tidak ditemukan"
                    );
                }

                Map<String, Object> menu =
                    new LinkedHashMap<>();

                menu.put("id", rs.getLong("id"));
                menu.put("name", rs.getString("name"));
                menu.put(
                    "categoryId",
                    rs.getLong("category_id")
                );
                menu.put(
                    "description",
                    rs.getString("description")
                );
                menu.put(
                    "price",
                    rs.getBigDecimal("price")
                );
                menu.put("slug", rs.getString("slug"));
                menu.put("image", rs.getString("image"));
                menu.put(
                    "isAvailable",
                    rs.getBoolean("is_available")
                );
                menu.put(
                    "isRecommended",
                    rs.getBoolean("is_recommended")
                );

                return menu;
            },
            id,
            branch
        );
    }

    // ========================================
    // UPDATE MENU LENGKAP
    // ========================================

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void update(
            @PathVariable long id,
            @RequestParam String branch,
            @RequestBody UpdateMenuRequest request) {

        validateBranch(branch);

        if (request == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Data menu wajib diisi"
            );
        }

        // VALIDASI NAMA
        String name = request.name() == null
            ? ""
            : request.name().trim();

        if (name.isBlank() || name.length() > 200) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Nama menu wajib diisi, maksimal 200 karakter"
            );
        }

        // VALIDASI KATEGORI
        Long categoryId = request.categoryId();

        if (categoryId == null || categoryId <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Kategori wajib dipilih"
            );
        }

        Integer categoryCount = jdbc.queryForObject("""
            SELECT COUNT(*)
            FROM menu_categories
            WHERE id = ?
              AND is_active = 1
            """,
            Integer.class,
            categoryId
        );

        if (categoryCount == null || categoryCount == 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Kategori tidak valid"
            );
        }

        // VALIDASI HARGA
        BigDecimal price = request.price();

        if (price == null ||
            price.signum() < 0 ||
            price.stripTrailingZeros().scale() > 2 ||
            price.compareTo(
                new BigDecimal("99999999.99")
            ) > 0) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Harga menu tidak valid"
            );
        }

        // VALIDASI DESKRIPSI
        String description = request.description() == null
            ? null
            : request.description().trim();

        // VALIDASI FOTO
        String image = request.image();

        if (image != null) {
            image = image.trim();

            if (image.isEmpty()) {
                image = null;
            }
        }

        // Foto baru hanya dari endpoint upload.
        // Foto lama tetap boleh dipertahankan.
        if (image != null &&
            !image.matches(
                "/uploads/menu/[a-f0-9-]{36}\\.(jpg|png|webp)"
            )) {

            String existingImage = jdbc.query("""
                SELECT m.image
                FROM branch_menu_items m
                JOIN branches b
                    ON b.id = m.branch_id
                WHERE m.id = ?
                  AND b.slug = ?
                  AND m.is_active = 1
                """,
                rs -> rs.next()
                    ? rs.getString("image")
                    : null,
                id,
                branch
            );

            if (!image.equals(existingImage)) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Path gambar tidak valid"
                );
            }
        }

        // VALIDASI STATUS
        if (request.isAvailable() == null ||
            request.isRecommended() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Status ketersediaan dan rekomendasi wajib diisi"
            );
        }

        // GENERATE SLUG
        String slug = createSlug(name);

        if (slug.isBlank() || slug.length() > 200) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Nama menu menghasilkan slug tidak valid"
            );
        }

        // UPDATE DATABASE
        try {
            int updated = jdbc.update("""
                UPDATE branch_menu_items m
                JOIN branches b
                    ON b.id = m.branch_id
                SET
                    m.name = ?,
                    m.slug = ?,
                    m.category_id = ?,
                    m.description = ?,
                    m.price = ?,
                    m.image = ?,
                    m.is_available = ?,
                    m.is_recommended = ?
                WHERE m.id = ?
                  AND b.slug = ?
                  AND m.is_active = 1
                """,
                name,
                slug,
                categoryId,
                description,
                price,
                image,
                request.isAvailable() ? 1 : 0,
                request.isRecommended() ? 1 : 0,
                id,
                branch
            );

            if (updated == 0 && !exists(id, branch)) {
                throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Menu tidak ditemukan"
                );
            }

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Nama atau slug menu sudah digunakan di cabang ini",
                exception
            );
        }
    }

    // ========================================
    // DELETE MENU - SOFT DELETE
    // ========================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void delete(
            @PathVariable long id,
            @RequestParam String branch) {

        validateBranch(branch);

        if (!exists(id, branch)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Menu tidak ditemukan"
            );
        }

        jdbc.update("""
            UPDATE branch_menu_items m
            JOIN branches b
                ON b.id = m.branch_id
            SET m.is_active = 0
            WHERE m.id = ?
              AND b.slug = ?
              AND m.is_active = 1
            """,
            id,
            branch
        );
    }

    // ========================================
    // HELPER
    // ========================================

    private boolean exists(long id, String branch) {
        Integer count = jdbc.queryForObject("""
            SELECT COUNT(*)
            FROM branch_menu_items m
            JOIN branches b
                ON b.id = m.branch_id
            WHERE m.id = ?
              AND b.slug = ?
              AND m.is_active = 1
            """,
            Integer.class,
            id,
            branch
        );

        return count != null && count > 0;
    }

    private static void validateBranch(String branch) {
        if (!"gresik".equals(branch) &&
            !"surabaya".equals(branch)) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cabang tidak valid"
            );
        }
    }

    private static String createSlug(String name) {
        String normalized = Normalizer.normalize(
            name.toLowerCase(Locale.ROOT),
            Normalizer.Form.NFD
        );

        return normalized
            .replaceAll("\\p{M}", "")
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");
    }
}
