<?php
$command = new Command([
	'refresh' => 'refresh apps in main menu and dock',
	'list' => 'list all apps',
	'open [APP]' => 'open an app',
	'close [APP]' => 'close an app',
	'kill [APP]' => 'kill an app'
]);
switch ($args[0]) {
	case 'list':
		$files = Files::dir("../../apps");
		$apps = array();
		foreach ($files as $app) {
			$apps[] = "<a href='javascript:;' onclick='main.apps.open(\"{$app['filename']}\");'>{$app['filename']}</a>";
		}
		asort($apps);
		$command->grid($apps);
		break;
	case 'open':
		$command->script("main.apps.open('{$args[1]}',true);");
		$return = "opened app '{$args[1]}'";
		break;
	case 'close':
		$command->script("main.apps.close('{$args[1]}');");
		$return = "closed app '{$args[1]}'";
		break;
	case 'kill':
		$command->script("main.apps.kill('{$args[1]}');");
		$return = "killed app '{$args[1]}'";
		break;
	case 'refresh':
		$command->script("main.apps.list();");
		$return = "refreshed app lists";
		break;
}
