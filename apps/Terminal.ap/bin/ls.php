<?php
$command = new Command();
$cwd = $session->get('cwd');
$files_object = Files::dir($cwd);
if ($files_object === false) {
	$command->error("$cwd does not exist!");
	return;
}
$files = [];
foreach ($files_object as $f) {
	$files[] = $f['name'];
}
if ($args[0] === "list") {
	$command->list($files);
} else {
	$command->grid($files);
}