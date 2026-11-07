<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = db();

    $query = $db->query("
        SELECT *
        FROM brand_profiles
        LIMIT 1
    ");

    echo json_encode([
        'profile' => $query->fetch() ?: null
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        'error' => 'Gagal mengambil profil'
    ]);
}