<?php

require_once __DIR__ . '/update.php';

updateOwnerRecord('branch_facilities', [
    'name' => 'ownerRequiredText',
    'description' => 'ownerText',
    'is_available' => 'ownerFlag',
], true);