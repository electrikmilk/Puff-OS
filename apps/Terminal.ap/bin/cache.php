<?php
$command = new Command([
	'count' => 'get number of items stored in cache',
	'purge' => 'purge the cache'
]);
switch ($args[0]) {
	case 'count':
		$return = "Number of items stored cache:";
		$command->script("$('.backlog ul').append('<li class=\'response\'>' + main.system.cache.count() + '</li>');");
		break;
	case 'purge':
		$command->script("main.system.cache.purge()");
		$return = "purged cache";
		break;
}
