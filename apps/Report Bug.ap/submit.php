<?php
// TODO: make this write to a database instead
require_once "../../lib/apis/application.php";
$name = $_POST['name'];
$version = $_POST['version'];
if ($version) $version = "($version)";
$message = $_POST['message'];
if (!$name) $name = "General";
if (Files::createFile("reports/$name $version-" . date("Y-m-d-H-i-s") . ".log", trim(strip_tags($message)))) {
	echo "success";
} else {
	echo "error";
}
