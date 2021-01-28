<?php
if($args[0]) {
  $url = $args[0];
  // make agent
  $split = explode(")",$_SERVER['HTTP_USER_AGENT']);
  $agent = "Mozilla/5.0 (compatible; Puff OS, https://puff.com)";
  $i = 0;
  foreach($split as $part) {
    if($i !== 0) {
      $agent .= $part;
    }
    if($i === 1)$agent .= ")";
    ++$i;
  }
  ini_set("user_agent",$agent);
  $ch = curl_init();
  curl_setopt ($ch, CURLOPT_AUTOREFERER, true);
  curl_setopt ($ch, CURLOPT_URL, $url);
  curl_setopt ($ch, CURLOPT_USERAGENT, $agent);
  curl_setopt ($ch, CURLOPT_VERBOSE, 1);
  curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
  curl_setopt ($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
  curl_setopt ($ch, CURLOPT_HEADER, 0);
  curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, 1);
  curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 5);
  $data = curl_exec($ch);
  curl_close($ch);
  if($data) {
    $return = "$url returned a response";
    if($args[1] === "r")$return = $data;
  } else $return = "$url did not give a response";
} else $return = "error give url";
