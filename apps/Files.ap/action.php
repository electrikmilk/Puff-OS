<?php
require_once '../../lib/apis/application.php';

$action = $_POST['action'];
if ($action) {
	if (file_exists("actions/$action.php")) {
		include_once "actions/$action.php";
	} else {
		die("action '$action' does not exist.");
	}
} else {
	die('no action was given');
}