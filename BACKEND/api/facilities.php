<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = db();

    $branch = $_GET['branch'] ?? 'gresik';

    $query = $db->prepare("
        SELECT
            f.id,
            f.name,
            f.description,
            f.image,
            f.icon,
            b.slug AS branch
        FROM branch_facilities AS f
        INNER JOIN branches AS b
            ON b.id = f.branch_id
        WHERE b.slug = ?
          AND b.is_active = 1
          AND f.is_available = 1
        ORDER BY f.sort_order ASC
    ");

    $query->execute([$branch]);

    echo json_encode([
        'branch' => $branch,
        'facilities' => $query->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        'error' => 'Gagal mengambil fasilitas'
    ]);
}