package com.kammari.web.controller;

import java.math.BigDecimal;
import java.text.Normalizer;
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
public class OwnerMenuCreateController {

    private final JdbcTemplate jdbc;

    public OwnerMenuCreateController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record CreateMenuRequest(
        String branch,
        Long categoryId,
        String name,
        String description,
        BigDecimal price,
        String image,
        Boolean isAvailable,
        Boolean isRecommended
    ) {}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Map<String, String> createMenu(
            @RequestBody CreateMenuRequest request) {

        if (request == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Data menu wajib diisi"
            );
        }

        // 1. VALIDASI CABANG
        String branch = request.branch();

        if (!"gresik".equals(branch) &&
            !"surabaya".equals(branch)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cabang tidak valid"
            );
        }

        Long branchId = jdbc.query("""
            SELECT id
            FROM branches
            WHERE slug = ? AND is_active = 1
            """,
            rs -> rs.next() ? rs.getLong("id") : null,
            branch
        );

        if (branchId == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cabang tidak ditemukan atau tidak aktif"
            );
        }

        // 2. VALIDASI KATEGORI
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
            WHERE id = ? AND is_active = 1
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

        // 3. VALIDASI NAMA
        String name = request.name() == null
            ? ""
            : request.name().trim();

        if (name.isBlank() || name.length() > 200) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Nama menu wajib diisi, maksimal 200 karakter"
            );
        }

        // 4. VALIDASI HARGA
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

        // 5. DESKRIPSI
        String description = request.description() == null
            ? null
            : request.description().trim();

        // 6. GAMBAR MENU
        String image = request.image() == null
            ? null
            : request.image().trim();

        if (image != null && image.isBlank()) {
            image = null;
        }

        // Hanya izinkan URL gambar hasil upload Owner.
        if (image != null &&
            !image.matches(
                "/uploads/menu/[a-f0-9-]{36}\\.(jpg|png|webp)"
            )) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Path gambar tidak valid"
            );
        }

        // 7. STATUS MENU
        boolean isAvailable =
            request.isAvailable() == null ||
            request.isAvailable();

        boolean isRecommended =
            Boolean.TRUE.equals(request.isRecommended());

        // 8. BUAT SLUG
        String slug = createSlug(name);

        if (slug.isBlank() || slug.length() > 200) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Nama menu menghasilkan slug tidak valid"
            );
        }

        // 9. CEK DUPLIKASI
        Integer duplicate = jdbc.queryForObject("""
            SELECT COUNT(*)
            FROM branch_menu_items
            WHERE branch_id = ? AND slug = ?
            """,
            Integer.class,
            branchId,
            slug
        );

        if (duplicate != null && duplicate > 0) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Menu dengan nama tersebut sudah ada di cabang ini"
            );
        }

        // 10. SIMPAN KE DATABASE
        try {
            jdbc.update("""
                INSERT INTO branch_menu_items (
                    branch_id,
                    category_id,
                    name,
                    slug,
                    description,
                    image,
                    price,
                    is_available,
                    is_recommended,
                    sort_order,
                    is_active
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)
                """,
                branchId,
                categoryId,
                name,
                slug,
                description,
                image,
                price,
                isAvailable ? 1 : 0,
                isRecommended ? 1 : 0
            );

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Slug menu sudah digunakan di cabang ini",
                exception
            );
        }

        return Map.of(
            "message", "Menu berhasil ditambahkan",
            "name", name,
            "branch", branch,
            "slug", slug
        );
    }

    private String createSlug(String name) {
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
