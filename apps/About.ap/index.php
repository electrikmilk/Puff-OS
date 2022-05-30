<?php
$app_name = $_GET['name'];
if (!$app_name) {
	?>
	<img src="/res/logo.png" width="64"/>
	<h3 id="name"></h3>
	<p id="version"></p>
	<p>A web desktop</p>
	<p>
	<?php
} else {
	$manifest = "../../apps/$app_name.ap/manifest.json";
	if (file_exists($manifest)) {
		$manifest = json_decode(file_get_contents($manifest), true);
		$icon = "/apps/$app_name.ap/icon/512.png";
		if (!file_exists("../../apps/$app_name.ap/icon/512.png")) {
			$icon = "/res/icons/app.svg";
		}
		echo "<img src='$icon' width=64/>";
		echo "<h3>{$manifest['name']}</h3>";
		echo "<p>Version <strong>{$manifest['version']}</strong></p><hr/>";
		if ($manifest['author']) {
			echo "<p>By {$manifest['author']}</p>";
		}
		if ($manifest['about']) {
			echo "<p><em>{$manifest['about']}</em></p>";
		}
	} else {
		echo "<p>App '$app_name' has not provided or has incorrect syntax in it's manifest.</p>";
	}
}
