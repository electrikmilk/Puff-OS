<?php
// list of apps...
$query = $_POST['query'];
$apps = array(
	"Files",
	"Camera",
	"Text Editor",
	"Calculator",
	"Terminal",
	"Process Manager",
	"Settings"
);
// $apps = Files::getInstance("../apps")->dir(); // null,"az",null,true
// foreach ($apps as $app) {
//   $name = $app['base'];
//   $simplename = str_replace(".ap","",$name);
//   $icon = "/apps/".str_replace(" ","\ ",$name)."/icon/64.png";
//   if(!file_exists("../apps/$name/icon/64.png"))$icon = "/res/icons/app.svg";
//   $info = json_decode(file_get_contents("../apps/$name/manifest.json"),true);
//   if((!$query && in_array(str_replace(".ap","",$name),$filter)) || ($query && $simplename === $query && !$info['service'])) {
//     if($query)$opening = " opening";
//     echo "<div class='app-item$opening' id='".uniqid()."' tooltip='{$info['name']}' onclick='apps.show(&quot;$simplename&quot;),apps.open(&quot;$simplename&quot;);' style='background-image:url($icon);'></div>";
//   }
// }

if ($query) {
	$name = $query;
	$icon = "/apps/" . str_replace(" ", "\ ", $name) . ".ap/icon/64.png";
	if (!file_exists("../apps/$name.ap/icon/64.png")) {
		$icon = "/res/icons/app.svg";
	}
	$info = json_decode(file_get_contents("../apps/$name.ap/manifest.json"), true);
	if ($info['service']) {
		return;
	}
	echo "<div class='app-item opening' id='" . uniqid('', true) . "' tooltip='{$info['name']}' onclick='apps.show(&quot;$name&quot;),apps.open(&quot;$name&quot;)' style='background-image:url($icon);'><div class='loader'></div></div>";
} else {
	foreach ($apps as $name) {
		$icon = "/apps/" . str_replace(" ", "\ ", $name) . ".ap/icon/64.png";
		if (!file_exists("../apps/$name.ap/icon/64.png")) {
			$icon = "/res/icons/app.svg";
		}
		$info = json_decode(file_get_contents("../apps/$name.ap/manifest.json"), true);
		echo "<div class='app-item' id='" . uniqid('', true) . "' tooltip='{$info['name']}' onclick='apps.show(&quot;$name&quot;),apps.open(&quot;$name&quot;)' style='background-image:url($icon);'></div>";
	}
}
