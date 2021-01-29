<?php
$files = Files::getInstance("../../apps");
$apps = array();
foreach($files->dir() as $app) {
  array_push($apps,$app['name']);
}
asort($apps);
foreach($apps as $app) {
  $return .= "$app\n";
}
