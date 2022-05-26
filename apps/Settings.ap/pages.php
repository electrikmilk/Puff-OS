<?php
require_once "../../lib/apis/application.php";
$files = Files::dir("pages");
foreach ($files as $page) {
	echo "<div data-page='{$page['name']}'>{$page['name']}</div>";
}
