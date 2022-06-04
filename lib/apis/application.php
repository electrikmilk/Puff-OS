<?php
$app_path = explode('/', getcwd());
define('APP_NAME', str_replace('.ap', '', end($app_path)));
define('APP_DIR', getcwd());
if (!defined('PUFF_DIR')) {
	define('PUFF_DIR', $_SERVER['DOCUMENT_ROOT']);
}
// Autoload App Classes
$classes = array("Cache", "Files", "Cookie", "Log");
spl_autoload_register(function ($className) use ($classes) {
	$url = $_SERVER['REQUEST_URI'];
	$path = $_SERVER['DOCUMENT_ROOT'] . "/classes/";
	$className = str_replace("\\", "/", $className);
	$class_path = "$path$className.php";
	if (!file_exists($class_path) || !in_array($className, $classes)) return false;
	require_once $class_path;
});