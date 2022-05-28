<?php
if ($args[0]) {
	if ($args[0] === "list") $return = "refreshed list of apps";
	elseif ($args[0] === "open") $return = "opened app '{$args[1]}'";
	elseif ($args[0] === "close") $return = "closed app '{$args[1]}'";
	else return;
	if ($args[1] && $args[0] === "open") echo "<script>main.apps.{$args[0]}('{$args[1]}',true);</script>";
	elseif ($args[1]) echo "<script>main.apps.{$args[0]}('{$args[1]}');</script>";
	else echo "<script>main.apps.{$args[0]}();</script>";
} else $return = "example usage: app open Terminal, app list, app close PID, app kill PID";
