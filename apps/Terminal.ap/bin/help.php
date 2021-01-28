<?php
$files = Files::getInstance("bin");
$return .= "available commands:\n";
$commands = array();
foreach($files->dir() as $command) {
  array_push($commands,$command['name']);
}
krsort($commands);
foreach($commands as $command) {
  $return .= "$command\n";
}
