<?php

require_once __DIR__ . '/requireOwner.php';
require_once __DIR__ . '/../config/database.php';

requirePost();
$body = readJson();

$email = is_string($body['email'] ?? null) ? trim($body['email']) : '';
$password = $body['password'] ?? null;

if (!filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !is_string($password) || $password === '') {
    respond(['error' => 'Masukkan email dan password yang valid.'], 422);
}

try {
    $query = db()->prepare(
        'SELECT id, password_hash FROM users WHERE email = ? LIMIT 1'
    );
    $query->execute([$email]);
    $owner = $query->fetch(PDO::FETCH_ASSOC);

    if (!$owner || !password_verify($password, $owner['password_hash'])) {
        respond(['error' => 'Email atau password salah.'], 401);
    }

    session_regenerate_id(true);
    $_SESSION = [
        'owner_id' => (int) $owner['id'],
        'csrf_token' => bin2hex(random_bytes(32)),
    ];

    respond([
        'message' => 'Login berhasil.',
        'csrf_token' => $_SESSION['csrf_token'],
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    respond(['error' => 'Login gagal diproses.'], 500);
}