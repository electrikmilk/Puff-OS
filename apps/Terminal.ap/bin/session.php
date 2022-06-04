<?php
$command = new Command([
	'id' => 'print current session id',
	'history' => 'list current session history',
	'clear' => 'clears all sessions and their history'
]);
switch ($args[0]) {
	case 'id':
		$command->output($session->id);
		break;
	case 'history':
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