<?php
define('PUFF_DIR', $_SERVER['DOCUMENT_ROOT']);
// Autoload Classes
spl_autoload_register(function ($className) {
	$path = $_SERVER['DOCUMENT_ROOT'] . "/classes/";
	$className = str_replace("\\", "/", $className);
	$class_path = "$path$className.php";
	if (!file_exists($class_path)) return false;
	include_once $class_path;
});
