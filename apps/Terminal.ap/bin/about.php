<?php
if($args[0])$path = "../{$args[0]}.ap/";
$info = json_decode(file_get_contents("{$path}manifest.json"),true);
$return = "{$info['name']} ({$info['version']}) sbin: {$info['sbin']}\n-------------------------------------\n{$info['about']}";
