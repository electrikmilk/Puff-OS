<?php
if ($args[0]) {
	preg_match('#\"(.*?)\"#', $_POST['command'], $matches);
	if ($matches[1]) {
		$return = $matches[1];
	} else {
		$return = "usage: echo \"hello, world!\"";
	}
} else {
	$return = "usage: echo \"hello, world!\"";
}