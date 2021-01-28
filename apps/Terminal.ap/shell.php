<?php
require_once "../../lib/apis/application.php";
$input = $_POST['command'];
$split = explode(" ",$_POST['command']);
$command = $split[0];
$args = array();
if(count($split) > 1) {
  foreach(explode(" ",str_replace("$command ","",str_replace("\ ","~",$input))) as $arg) {
    array_push($args,str_replace("~"," ",$arg));
  }
}
$return;
if(!$input)return;
else {
  if(file_exists("bin/$command.php"))include_once "bin/$command.php";
  else $return = "command not found: $command, run 'help' for help";
}
echo nl2br(trim(strip_tags($return)));
