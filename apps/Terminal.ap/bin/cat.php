<?php
$command = new Command([
	'cat [FILE]' => 'print contents of file'
]);
if (count($args)) {
	$cwd = $session->get('cwd');
	$path = "$cwd/{$args[0]}";
	if (!file_exists($path)) {
		$command->error("Not found: $path");
	} elseif (is_dir($path)) {
		$command->error("Is a directory: $path");
	} else {
		$escape = false;
		$command->output(file_get_contents($path));
	}
}