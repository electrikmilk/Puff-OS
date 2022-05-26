<?php
define('APP', end(explode("/", __DIR__)));
// Autoload App Classes
$classes = array("Cache", "Files", "Cookie");
spl_autoload_register(function ($className) {
	$url = $_SERVER['REQUEST_URI'];
	$path = $_SERVER['DOCUMENT_ROOT'] . "/classes/";
	$className = str_replace("\\", "/", $className);
	$class_path = "$path$className.php";
	if (!file_exists($class_path) && in_array($classes)) return false;
	require_once $class_path;
});
