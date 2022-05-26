<?php
if ($args[0]) {
	$cwd = $session->get('cwd');
	$path = "$cwd/{$args[0]}";
	if (!file_exists($path)) {
		$return = "Not found: $path";
	} elseif (is_dir($path)) {
		$return = "Is a directory: $path";
	} else {
		echo file_get_contents($path);
	}
} else {
	$return = "output file contents; usage: cat {file}";
}