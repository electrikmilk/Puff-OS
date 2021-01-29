<?php
$dontstrip = true;
$files = Files::getInstance("../../apps");
$apps = array();
foreach($files->dir() as $app) {
  array_push($apps,$app['name']);
}
asort($apps);
foreach($apps as $app) {
  $list .= "$app\n";
}
$return .= "<div class='shortlist'>$list</div>";
