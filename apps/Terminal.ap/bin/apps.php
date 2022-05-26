<?php
$escape = false;
$files = Files::dir("../../apps");
$apps = array();
foreach ($files as $app) {
	array_push($apps, $app['name']);
}
asort($apps);
foreach ($apps as $app) {
	$list .= "<div><a href='javascript:;' onclick='main.apps.open(&quot;$app&quot;);'>$app</a></div>";
}
$return .= "<div class='shortlist'>$list</div>";
