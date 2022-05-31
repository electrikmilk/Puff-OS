<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
$path = $_POST['path'];
$new_content = $_POST['content'];
$file = new File($path);
$file->write($new_content);
echo "saved";