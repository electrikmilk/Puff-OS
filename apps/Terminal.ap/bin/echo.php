<?php
if (count($args)) {
	preg_match('#\"(.*?)\"#', $_POST['command'], $matches);
	if ($matches[1]) {
		$return = $matches[1];
	}
} else {
	$return = "usage: echo \"hello, world!\"";
}