<?php
$command = new Command([
	'about [APP]' => 'output manifest for app'
]);
$path = PUFF_DIR . "/apps/{$args[0]}.ap/manifest.json";
if (file_exists($path)) {
	$info = json_decode(file_get_contents($path), true);
	$command->table($info);
} else {
	$command->output('App does not exist');
}
