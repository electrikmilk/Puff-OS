<?php
$cwd = $session->get('cwd');
if (count($args)) {
	$path = str_split($args[0]);
	if ($args[0] === '..') {
		$split_path = explode('/', $cwd);
		unset($split_path[count($split_path) - 1]);
		$new_cwd = implode('/', $split_path);
	} elseif ($path[0] === "/") {
		$new_cwd = $args[0];
	} elseif ($cwd !== '/') {
		$new_cwd = "$cwd/{$args[0]}";
	} else {
		$new_cwd = $cwd . $args[0];
	}
	if ($new_cwd === '') {
		$new_cwd = '/';
	}
	if ($args[0] !== $cwd) {
		$session->set('cwd', $new_cwd);
	}
} else {
	$session->set('cwd', '/');
}