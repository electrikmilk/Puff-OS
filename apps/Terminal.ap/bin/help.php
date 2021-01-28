<?php
$files = Files::getInstance("bin");
$return .= "available commands:\n";
$commands = array();
foreach($files->dir() as $command) {
  array_push($commands,$command['name']);
}
asort($commands);
foreach($commands as $command) {
  $return .= "$command\n";
}
