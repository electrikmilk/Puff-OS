<?php
$cwd = $session->get('cwd');
if ($args[0]) {
	if ($args[0] !== $cwd) {
		$session->set('cwd', $args[0]);
	}
} else {
	$return = "usage: cd {path}";
}