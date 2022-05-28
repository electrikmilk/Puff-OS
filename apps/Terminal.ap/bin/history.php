<?php
if (!$args[0]) {
	$return = file_get_contents($history_file);
} elseif ($args[0] === 'clear') {
	$sessions = Files::dir('sessions');
	foreach ($sessions as $session) {
		$return .= "Deleted {$session['name']}...\n";
		unlink("sessions/{$session['name']}");
	}
}
