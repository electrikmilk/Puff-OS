<?php
require_once "../../../lib/apis/application.php";
$page = $_POST['page'];
$page_file = "$page.php";
if (!file_exists($page_file)) {
	die("Page '$page' does not exist.");
}
include_once $page_file;