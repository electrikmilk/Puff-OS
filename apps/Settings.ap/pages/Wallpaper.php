<?php
require_once "../../lib/apis/application.php";
$files = Files::getInstance("../../../res/wallpapers",false);
foreach($files->dir() as $wp) {
  echo "<img src='/res/wallpapers/{$wp['base']}' width='300'/><hr/>";
}
