<?php
$dontstrip = true;
$files = Files::getInstance("bin");
$return .= "\n";
$commands = array();
foreach($files->dir() as $command) {
  array_push($commands,$command['name']);
}
asort($commands);
foreach($commands as $command) {
  $list .= "<div>$command</div>";
}
$return .= "available commands:\n<div class='shortlist'>$list</div>";
