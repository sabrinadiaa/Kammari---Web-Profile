<?php

require_once __DIR__ . '/update.php';

updateOwnerRecord('branches', [
    'name' => 'ownerRequiredText',
    'address' => 'ownerText',
    'phone' => 'ownerText',
    'whatsapp' => 'ownerText',
    'reservation_info' => 'ownerText',
    'open_time' => 'ownerTime',
    'close_time' => 'ownerTime',
    'is_active' => 'ownerFlag',
]);