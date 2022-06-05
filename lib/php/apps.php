<?php
// list apps in dock...
$favorite_apps = json_decode(file_get_contents(PUFF_DIR . '/etc/dock.json'), true);
$name = $_POST['query'];
if ($name) {
	$manifest = json_decode(file_get_contents("../apps/$name.ap/manifest.json"), true);
	if ($manifest['service']) {
		return;
	}
	$icon = "/apps/" . str_replace(" ", "\ ", $name) . ".ap/icon/64.png";
	if (!file_exists("../apps/$name.ap/icon/64.png")) {
		$icon = "/res/icons/app.svg";
	}
	echo "<div class='app-item opening' id='" . uniqid('', true) . "' tooltip='{$manifest['name']}' onclick='apps.open(\"$name\")' style='background-image:url($icon);'><div class='loader'></div></div>";
} else {
	foreach ($favorite_apps as $name) {
		if (!file_exists("../apps/$name.ap/")) {
			continue;
		}
		$icon = "/apps/" . str_replace(" ", "\ ", $name) . ".ap/icon/64.png";
		if (!file_exists("../apps/$name.ap/icon/64.png")) {
			$icon = "/res/icons/app.svg";
		}
		$manifest = json_decode(file_get_contents("../apps/$name.ap/manifest.json"), true);
		echo "<div class='app-item' id='" . uniqid('', true) . "' tooltip='" . ($manifest['name'] ?? $name) . "' onclick='apps.open(\"$name\")' style='background-image:url($icon);'></div>";
	}
}
