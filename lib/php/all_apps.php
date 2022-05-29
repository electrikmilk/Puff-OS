<?php
$apps = Files::dir(PUFF_DIR . "/apps");
foreach ($apps as $app) {
	$name = $app['filename'];
	$icon = "/apps/{$app['name']}/icon/16.png";
	if (!file_exists(PUFF_DIR . "/apps/{$app['name']}/icon/16.png")) {
		$icon = "/res/icons/app.svg";
	}
	$manifest_file = PUFF_DIR . "/apps/{$app['name']}/manifest.json";
	if (!file_exists($manifest_file)) {
		continue;
	}
	$manifest = json_decode(file_get_contents($manifest_file), true);
	if (!$manifest['service']) {
		echo "<li class='app-menu-item' onclick='apps.open(\"$name\")'>";
		echo "<img src='$icon' width='16' height='16' class='window-icon' alt='{$manifest['name']}'/>";
		echo "<span style='margin-left: 3px;'>{$manifest['name']}</span>";
		echo "</li>";
	}
}
