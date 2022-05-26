<?php
// todo: explore proc_open()
preg_match('#\"(.*?)\"#', $_POST['command'], $matches);
if ($matches[1]) {
	$cwd = $session->get('cwd');
	$return = $matches[1];
	$output = [];
	$code = 0;
	exec($matches[1], $output, $code);
	$return = implode("\n", $output) . "\n------------\nresult_code: $code";
} else {
	$return = "execute command on host machine; usage: unsafe \"command\"";
}