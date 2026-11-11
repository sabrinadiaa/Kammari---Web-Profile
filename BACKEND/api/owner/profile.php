/** owner edit history caffe, nambahin di db jg brand profiles */

<?php

require_once __DIR__ . '/update.php';

updateOwnerRecord('brand_profiles', [
    'brand_name' => 'ownerRequiredText',
    'description' => 'ownerText',
]);