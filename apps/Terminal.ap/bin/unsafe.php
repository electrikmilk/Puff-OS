<?php
// todo: explore proc_open()
$command = new Command();
preg_match('#\"(.*?)\"#', $_POST['command'], $matches);
if ($matches[1]) {
	$output = [];
	$code = 0;
	exec($matches[1], $output, $code);
	$command->list($output, "result code: $code");
} else {
	$return = "execute command on host machine; usage: unsafe \"command\"";
}