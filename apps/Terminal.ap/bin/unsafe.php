<?php
// todo: explore proc_open()
$command = new Command([
	"unsafe \"command\"" => 'execute command on host machine'
]);
if (count($args)) {
	preg_match('#\"(.*?)\"#', $_POST['command'], $matches);
	if ($matches[1]) {
		$output = [];
		$code = 0;
		exec($matches[1], $output, $code);
		$command->list($output);
		$command->output($command->banner("result code: $code"));
	}
}