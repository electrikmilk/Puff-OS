<?php
$command = new Command();
$bins = Files::dir("bin");
if ($bins) {
	$commands = array();
	foreach ($bins as $file) {
		$commands[] = $file['filename'];
	}
	asort($commands);
	$command->grid($commands, 'Available Commands');
}
