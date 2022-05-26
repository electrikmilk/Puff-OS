<?php
$escape = false;
$files = Files::dir("bin");
$return = "\n";
$commands = array();
foreach ($files as $file) {
	$commands[] = $file['filename'];
}
asort($commands);
$list = "";
foreach ($commands as $command) {
	$list .= "<div>$command</div>";
}
$return .= "available commands:\n<div class='shortlist'>$list</div>";
