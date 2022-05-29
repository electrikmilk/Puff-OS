<?php
$path = $_POST['path'];
$new_content = $_POST['content'];
$file = new File($path);
$file->update($new_content);
echo "saved";