<?php

require_once __DIR__ . '/update.php';

updateOwnerRecord('branch_menu_items', [
    'name' => 'ownerRequiredText',
    'description' => 'ownerText',
    'price' => static function ($value): bool {
        return (is_string($value) || is_int($value))
            && preg_match('/\A\d+(?:\.\d{1,2})?\z/', (string) $value) === 1;
    },
    'is_available' => 'ownerFlag',
    'is_recommended' => 'ownerFlag',
    'is_active' => 'ownerFlag',
], true);