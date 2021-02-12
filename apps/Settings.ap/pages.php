<?php
require_once "../../lib/apis/application.php";
$files = Files::getInstance("pages");
foreach($files->dir() as $page) {
  echo "<div data-page='{$page['name']}'>{$page['name']}</div>";
}
