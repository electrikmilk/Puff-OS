<?php
require_once "../../lib/apis/application.php";
$files = Files::dir("pages");
foreach ($files as $page) {
	if ($page['filename'] === 'page') continue;
	echo "<div data-page='{$page['filename']}'>{$page['filename']}</div>";
}
