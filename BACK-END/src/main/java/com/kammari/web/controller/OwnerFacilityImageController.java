package com.kammari.web.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class OwnerFacilityImageController {

    private static final long MAX_SIZE =
        5L * 1024 * 1024;

    private final Path uploadDir = Path.of(
        "uploads", "facilities"
    ).toAbsolutePath().normalize();

    @PostMapping(
        value = "/api/owner/facility-images",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, String> upload(
        @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty() ||
            file.getSize() > MAX_SIZE) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Foto wajib diisi dan maksimal 5 MB"
            );
        }

        try {
            String extension;

            try (InputStream input = file.getInputStream()) {
                extension = detectImage(
                    input.readNBytes(12)
                );
            }

            if (extension == null) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Gunakan JPG, PNG, atau WebP"
                );
            }

            Files.createDirectories(uploadDir);

            String filename =
                UUID.randomUUID() + "." + extension;

            Path destination = uploadDir.resolve(filename);

            try (InputStream input = file.getInputStream()) {
                Files.copy(input, destination);
            } catch (IOException ex) {
                Files.deleteIfExists(destination);
                throw ex;
            }

            return Map.of(
                "message", "Foto berhasil diunggah",
                "image", "/uploads/facilities/" + filename
            );

        } catch (IOException ex) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Gagal menyimpan foto",
                ex
            );
        }
    }

    @GetMapping("/uploads/facilities/{filename}")
    public ResponseEntity<Resource> getImage(
        @PathVariable String filename
    ) {
        if (!filename.matches(
            "[a-f0-9-]{36}\\.(jpg|png|webp)"
        )) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Foto tidak ditemukan"
            );
        }

        Path file = uploadDir.resolve(filename).normalize();

        if (!file.getParent().equals(uploadDir) ||
            !Files.isRegularFile(file)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Foto tidak ditemukan"
            );
        }

        try {
            Resource resource =
                new UrlResource(file.toUri());

            String contentType = Files.probeContentType(file);

            if (contentType == null) {
                contentType = switch (
                    filename.substring(
                        filename.lastIndexOf('.') + 1
                    )
                ) {
                    case "jpg" -> "image/jpeg";
                    case "png" -> "image/png";
                    case "webp" -> "image/webp";
                    default -> "application/octet-stream";
                };
            }

            return ResponseEntity.ok()
                .contentType(
                    MediaType.parseMediaType(contentType)
                )
                .header(
                    "X-Content-Type-Options",
                    "nosniff"
                )
                .body(resource);

        } catch (IOException ex) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Gagal membaca foto",
                ex
            );
        }
    }

    private String detectImage(byte[] b) {
        if (b.length >= 3 &&
            (b[0] & 255) == 255 &&
            (b[1] & 255) == 216 &&
            (b[2] & 255) == 255) {
            return "jpg";
        }

        if (b.length >= 8 &&
            (b[0] & 255) == 137 &&
            b[1] == 80 &&
            b[2] == 78 &&
            b[3] == 71 &&
            b[4] == 13 &&
            b[5] == 10 &&
            b[6] == 26 &&
            b[7] == 10) {
            return "png";
        }

        if (b.length >= 12 &&
            ascii(b, 0, "RIFF") &&
            ascii(b, 8, "WEBP")) {
            return "webp";
        }

        return null;
    }

    private boolean ascii(
        byte[] b,
        int offset,
        String value
    ) {
        for (int i = 0; i < value.length(); i++) {
            if (b[offset + i] !=
                (byte) value.charAt(i)) {
                return false;
            }
        }

        return true;
    }
}
