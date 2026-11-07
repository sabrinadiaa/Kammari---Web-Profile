<?php

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');

$branch = $_GET['branch'] ?? 'gresik';

$allowedBranches = ['gresik', 'surabaya'];

if (!in_array($branch, $allowedBranches, true)) {
    http_response_code(400);

    echo json_encode([
        'error' => 'Cabang tidak valid'
    ]);

    exit;
}

try {
    $db = db();

    $sql = "
        SELECT
            m.id,
            m.name,
            m.slug,
            m.description,
            m.price,
            m.image,
            m.is_available,
            m.is_recommended,
            c.slug AS category_slug,
            c.name AS category_name,
            c.description AS category_description
        FROM branch_menu_items AS m
        INNER JOIN branches AS b
            ON b.id = m.branch_id
        INNER JOIN menu_categories AS c
            ON c.id = m.category_id
        WHERE b.slug = ?
          AND b.is_active = 1
          AND m.is_active = 1
          AND c.is_active = 1
        ORDER BY
            c.sort_order ASC,
            m.sort_order ASC,
            m.id ASC
    ";

    $query = $db->prepare($sql);
    $query->execute([$branch]);

    echo json_encode([
        'branch' => $branch,
        'items' => $query->fetchAll()
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    error_log($e->getMessage());

    http_response_code(500);

    echo json_encode([
        'error' => 'Gagal terhubung atau membaca database'
    ]);
}