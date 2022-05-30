<?php
$command = new Command();
$cwd = $session->get('cwd');
$files_object = Files::dir($cwd);
$files = [];
foreach ($files_object as $f) {
	$files[] = $f['name'];
}
if ($args[0] === "list") {
	$command->list($files);
} else {
	$command->grid($files);
}