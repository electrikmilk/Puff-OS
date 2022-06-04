<?php
$cwd = $session->get('cwd');
if (count($args)) {
	$new_cwd = $args[0];
	if ($cwd !== '/') {
		$new_cwd = "$cwd/{$args[0]}";
	} else {
		$new_cwd = $cwd . $args[0];
	}
	if ($args[0] !== $cwd) {
		$session->set('cwd', $new_cwd);
	}
} else {
	$session->set('cwd', '/');
}