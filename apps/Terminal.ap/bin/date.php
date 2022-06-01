<?php
$command = new Command([
	'iso' => 'output in iso 8601 format',
	'epoch' => 'output as unix time',
	'utc' => 'output as utc',
	'stamp' => 'output as standard timestamp',
	'h' => 'output as human readable'
]);
if (count($args)) {
	switch ($args[0]) {
		case 'iso':
			$command->output(date('c'));
			break;
		case 'epoch':
			$command->output(time());
			break;
		case 'utc':
			$command->output(gmdate('c'));
			break;
		case 'stamp':
			$command->output(date('Y-m-d H:i:s'));
			break;
		case 'h':
			$command->output(date('l, F j, Y, g:i a'));
			break;
	}
}