<?php
header('Content-Type: application/json; charset=utf-8');

$branch = $_GET['branch'] ?? 'gresik';

if (!in_array($branch, ['gresik', 'surabaya'], true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Cabang tidak valid']);
    exit;
}

try {
    $db = new PDO(
        'mysql:host=127.0.0.1;dbname=kammari_cafe;charset=utf8mb4',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $sql = "SELECT
                m.id,
                m.name,
                m.description,
                m.price,
                m.image,
                c.slug AS category_slug,
                c.name AS category_name,
                c.description AS category_description
            FROM branch_menu_items m
            JOIN branches b ON b.id = m.branch_id
            JOIN menu_categories c ON c.id = m.category_id
            WHERE (
                b.slug = ?
                OR b.slug = ?
                OR LOWER(b.name) LIKE ?
            )
            AND b.is_active = 1
            AND m.is_active = 1
            AND c.is_active = 1
            ORDER BY c.sort_order, m.sort_order, m.id";

    $stmt = $db->prepare($sql);
    $stmt->execute([
        $branch,
        'kammari-' . $branch,
        '%' . $branch . '%'
    ]);

    echo json_encode(
        ['items' => $stmt->fetchAll(PDO::FETCH_ASSOC)],
        JSON_UNESCAPED_UNICODE
    );

} catch (Throwable $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Gagal membaca database']);
}