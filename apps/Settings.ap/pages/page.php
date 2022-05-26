<?php
require_once "../../../lib/apis/application.php";
$page = $_POST['page'];
if (!file_exists($page)) {
	die("Page '$page' does not exist.");
}
include_once $page;