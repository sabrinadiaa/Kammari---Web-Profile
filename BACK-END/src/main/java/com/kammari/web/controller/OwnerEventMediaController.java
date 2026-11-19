package com.kammari.web.controller;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
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
public class OwnerEventMediaController {

    private static final long MAX_POSTER =
        5L * 1024 * 1024;

    private static final long MAX_VIDEO =
        50L * 1024 * 1024;

    private final Path uploadDir = Path.of(
        "uploads", "events"
    ).toAbsolutePath().normalize();

    // =====================================
    // UPLOAD POSTER / VIDEO - OWNER
    // =====================================

    @PostMapping(
        value = "/api/owner/event-media",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public Map<String, String> upload(
        @RequestParam("file") MultipartFile file,
        @RequestParam("type") String type
    ) {
        boolean poster = "poster".equals(type);
        boolean video = "video".equals(type);

        if (!poster && !video) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Tipe media tidak valid"
            );
        }

        long maxSize = poster ? MAX_POSTER : MAX_VIDEO;

        if (file.isEmpty() || file.getSize() > maxSize) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                poster
                    ? "Poster maksimal 5 MB"
                    : "Video maksimal 50 MB"
            );
        }

        String extension;

        try (InputStream input = file.getInputStream()) {
            byte[] header = input.readNBytes(16);
            extension = detectType(header, poster);
        } catch (IOException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "File tidak dapat dibaca"
            );
        }

        if (extension == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Format media tidak didukung"
            );
        }

        try {
            Files.createDirectories(uploadDir);

            String filename =
                UUID.randomUUID() + "." + extension;

            Path destination = uploadDir.resolve(filename);

            try (InputStream input = file.getInputStream()) {
                Files.copy(
                    input,
                    destination,
                    StandardCopyOption.COPY_ATTRIBUTES
                );
            } catch (IOException ex) {
                Files.deleteIfExists(destination);
                throw ex;
            }

            return Map.of(
                "message", "Media berhasil diunggah",
                "url", "/uploads/events/" + filename
            );

        } catch (IOException ex) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Gagal menyimpan media",
                ex
            );
        }
    }

    // =====================================
    // MENAMPILKAN MEDIA KE PENGUNJUNG
    // =====================================

    @GetMapping("/uploads/events/{filename}")
    public ResponseEntity<Resource> getMedia(
        @PathVariable String filename
    ) {
        if (!filename.matches(
            "[a-f0-9-]{36}\\.(jpg|png|webp|mp4|webm)"
        )) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Media tidak ditemukan"
            );
        }

        Path file = uploadDir.resolve(filename).normalize();

        if (!file.getParent().equals(uploadDir)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Media tidak ditemukan"
            );
        }

        try {
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Media tidak ditemukan"
                );
            }

            String extension = filename.substring(
                filename.lastIndexOf('.') + 1
            );

            String contentType = switch (extension) {
                case "jpg" -> "image/jpeg";
                case "png" -> "image/png";
                case "webp" -> "image/webp";
                case "mp4" -> "video/mp4";
                case "webm" -> "video/webm";
                default -> "application/octet-stream";
            };

            return ResponseEntity.ok()
                .contentType(
                    MediaType.parseMediaType(contentType)
                )
                .header("X-Content-Type-Options", "nosniff")
                .body(resource);

        } catch (IOException ex) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Gagal membaca media",
                ex
            );
        }
    }

    // =====================================
    // VALIDASI HEADER FILE
    // =====================================

    private String detectType(
        byte[] bytes,
        boolean poster
    ) {
        if (poster) {
            // JPEG
            if (bytes.length >= 3 &&
                (bytes[0] & 255) == 255 &&
                (bytes[1] & 255) == 216 &&
                (bytes[2] & 255) == 255) {
                return "jpg";
            }

            // PNG
            if (bytes.length >= 8 &&
                (bytes[0] & 255) == 137 &&
                bytes[1] == 80 &&
                bytes[2] == 78 &&
                bytes[3] == 71 &&
                bytes[4] == 13 &&
                bytes[5] == 10 &&
                bytes[6] == 26 &&
                bytes[7] == 10) {
                return "png";
            }

            // WEBP
            if (bytes.length >= 12 &&
                ascii(bytes, 0, "RIFF") &&
                ascii(bytes, 8, "WEBP")) {
                return "webp";
            }

        } else {
            // MP4
            if (bytes.length >= 12 &&
                ascii(bytes, 4, "ftyp")) {
                return "mp4";
            }

            // WEBM
            if (bytes.length >= 4 &&
                (bytes[0] & 255) == 0x1A &&
                (bytes[1] & 255) == 0x45 &&
                (bytes[2] & 255) == 0xDF &&
                (bytes[3] & 255) == 0xA3) {
                return "webm";
            }
        }

        return null;
    }

    private boolean ascii(
        byte[] bytes,
        int offset,
        String text
    ) {
        for (int i = 0; i < text.length(); i++) {
            if (bytes[offset + i] !=
                (byte) text.charAt(i)) {
                return false;
            }
        }

        return true;
    }
}
