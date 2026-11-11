<?php

require_once __DIR__ . '/update.php';

updateOwnerRecord('events', [
    'title' => 'ownerRequiredText',
    'description' => 'ownerText',
], true);