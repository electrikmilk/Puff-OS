<?php
require_once 'Session.php';
$session = new Session($_POST['session']);
$user = $_SERVER['PHP_AUTH_USER'] ?? 'anon';
$host = $_SERVER['SERVER_NAME'] . ($_SERVER['SERVER_PORT'] ? ':' . $_SERVER['SERVER_PORT'] : '');
$symbol = "$";
$cwd = $session->get('cwd');
echo "$user@$host $cwd $symbol";