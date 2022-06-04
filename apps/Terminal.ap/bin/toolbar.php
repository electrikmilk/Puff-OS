<?php
$command = new Command([
	'start' => 'Start toolbar after closing it',
	'refresh' => 'Refresh toolbar apps',
	'close' => 'Close toolbar in the case its having issues'
]);
if (count($args[0])) {
	switch ($args[0]) {
		case 'start':
			$command->script('main.apps.toolbar();');
			break;
		case 'refresh':
			$command->script('main.apps.toolbarApps();');
			break;
		case 'close':
			$command->script('main.apps.closeToolbar();');
			break;
	}
}
