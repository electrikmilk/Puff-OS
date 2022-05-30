<?php
new Command([
	'list' => 'list current session history',
	'clear' => 'clears all sessions and their history'
]);
switch ($args[0]) {
	case 'list':
		$return = file_get_contents($history_file);
		break;
	case 'clear':
		$sessions = Files::dir('sessions');
		foreach ($sessions as $session) {
			$return .= "Deleted {$session['name']}...\n";
			unlink("sessions/{$session['name']}");
		}
		break;
}