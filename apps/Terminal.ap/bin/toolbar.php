<?php
$command = new Command([
	'start' => 'Start toolbar after closing it',
	'refresh' => 'Refresh toolbar apps',
	'close' => 'Close toolbar in the case its having issues'
]);
if (count($args[0])) {
	switch ($args[0]) {
		case 'start':
			$command->script('main.Toolbar.start();');
			break;
		case 'refresh':
			$command->script('main.Toolbar.refresh();');
			break;
		case 'close':
			$command->script('main.Toolbar.kill();');
			break;
	}
}
