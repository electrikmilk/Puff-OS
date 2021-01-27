<?php
require_once "../globals.php";
$action = $_POST['action'];
if($action) {
  if(file_exists("php/$action.php"))include_once "php/$action.php";
  else echo "action does not exist";
} else echo "no action";
