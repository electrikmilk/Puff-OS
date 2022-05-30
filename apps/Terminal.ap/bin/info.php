<?php
$command = new Command();
$command->table([
	'url' => $_SERVER['HTTP_REFERER'],
	'user agent' => $_SERVER['HTTP_USER_AGENT']
]);