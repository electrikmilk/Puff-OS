<?php
$cwd = $session->get('cwd');
if (count($args)) {
	$new_cwd = $args[0];
	if (str_split($args[0])[0] !== '/') {
		$new_cwd = "$cwd/{$args[0]}";
	}
	if ($args[0] !== $cwd) {
		$session->set('cwd', $new_cwd);
	}
} else {
	$session->set('cwd', '/');
}