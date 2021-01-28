<?php
if($args[0]) {
  if($args[0] === "list")$return = "refreshed list of apps";
  else if($args[0] === "open")$return = "opened app '{$args[1]}'";
  else if($args[0] === "close")$return = "closed app '{$args[1]}'";
  else return;
  if($args[1])echo "<script>main.apps.{$args[0]}('{$args[1]}');</script>";
  echo "<script>main.apps.{$args[0]}();</script>";
}
