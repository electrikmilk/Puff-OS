<?php
require_once "../../lib/apis/application.php";
$name = $_POST['name'];
$version = $_POST['version'];
if($version)$version = "($version)";
$message = $_POST['message'];
if(!$name)$name = "General";
$files = Files::getInstance("reports");
if($files->file("$name$version-".date("YmdHis").".log",trim(strip_tags($message))))echo "success";
else echo "error";
