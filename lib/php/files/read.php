<?php
$path = $_POST['path'];
$file = new File($path);
$contents = $file->read();
if ($_POST['escape']) {
	$contents = htmlentities($contents);
}
if ($_POST['nl2br']) {
	$contents = nl2br($contents);
}
echo $contents;