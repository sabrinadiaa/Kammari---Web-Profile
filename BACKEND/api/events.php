<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $db = db();

    $branch = $_GET['branch'] ?? '';

        $sql = "
        SELECT
            e.id,
            e.title,
            e.slug,
            e.description,
            e.start_at,
            e.end_at,
            e.poster,
            e.video,
            e.registration_url,
            e.status,
            b.name AS branch_name,
            b.slug AS branch_slug
        FROM events e
        LEFT JOIN branches b
            ON b.id = e.branch_id
        WHERE b.is_active = 1
        AND e.status IN ('upcoming', 'ongoing', 'completed')
    ";
    $params = [];

    if ($branch !== '') {
        $sql .= " AND b.slug = ?";
        $params[] = $branch;
    }

    $sql .= " ORDER BY e.start_at DESC";

    $query = $db->prepare($sql);
    $query->execute($params);

    echo json_encode([
        "events" => $query->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);

    echo json_encode([
        "error" => "Gagal mengambil data event"
    ]);
}