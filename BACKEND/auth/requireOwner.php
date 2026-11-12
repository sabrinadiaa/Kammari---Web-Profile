<?php

ini_set('session.use_strict_mode', '1');

session_start([
    'cookie_httponly' => true,
    'cookie_secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'cookie_samesite' => 'Lax',
]);

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function requirePost(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        respond(['error' => 'Gunakan metode POST.'], 405);
    }
}

function readJson(): array
{
    $body = json_decode(file_get_contents('php://input'), true);

    if (!is_array($body)) {
        respond(['error' => 'Kirim data dalam format JSON.'], 400);
    }

    return $body;
}

function requireOwner(): void
{
    if (empty($_SESSION['owner_id'])) {
        respond(['error' => 'Silakan login sebagai owner.'], 401);
    }
}

function requireOwnerWrite(): void
{
    requirePost();
    requireOwner();

    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    $expected = $_SESSION['csrf_token'] ?? '';

    if ($expected === '' || !hash_equals($expected, $token)) {
        respond(['error' => 'Token CSRF tidak valid.'], 403);
    }
}