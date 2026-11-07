<?php

require_once __DIR__ . '/../config/database.php';

try {
    $db = db();

    $query = $db->query(
        "SELECT id, name, slug, address, phone, whatsapp,
                instagram, reservation_info, open_time,
                close_time, google_maps_url
         FROM branches
         WHERE is_active = 1
         ORDER BY id"
    );

    echo json_encode([
        "branches" => $query->fetchAll()
    ]);

} catch (Exception $e) {
    http_response_code(500);

    echo json_encode([
        "error" => "Gagal mengambil data cabang"
    ]);
}