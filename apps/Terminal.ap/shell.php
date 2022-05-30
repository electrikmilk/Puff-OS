<?php
require_once '../../lib/apis/application.php';
require_once 'Session.php';
require_once 'Command.php';

// Process session
if (!$_POST['session']) {
	die('ERROR: No session key.');
}
$session = new Session($_POST['session']);

// Check input
$input = $_POST['command'];
if (!$input) {
	return;
}

// Init History
$history_file = "sessions/{$_POST['session']}.history";
if (!file_exists($history_file)) {
	file_put_contents($history_file, "# start of session: {$_POST['session']}");
}
$history = fopen($history_file, 'ab');
unset($_POST['session']); // maybe this will change later
// Write to history
fwrite($history, "\n [" . date("Y-m-d H:i:s") . "] {$_POST['command']}");
fclose($history);

// Process command
$split = explode(" ", $_POST['command']);
$command = $split[0];

// Pass to command
$return = "";
$escape = true;
if (file_exists("bin/$command.php")) {
	// Process args
	$args = array();
	foreach ($split as $arg) {
		if ($arg === $split[0]) continue;
		$args[] = $arg;
	}
//	foreach (explode(" ", str_replace("$command ", "", str_replace("\ ", "~", $input))) as $arg) {
//		$args[] = str_replace("~", " ", $arg);
//	}
	include_once "bin/$command.php";
} else {
	$return = "command not found: $command";
}
// Process output and print
if ($escape) {
	$return = strip_tags($return);
}
echo nl2br(trim($return));