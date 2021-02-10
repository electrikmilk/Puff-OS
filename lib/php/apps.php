<?php
$filter = array(
  "Terminal",
  "Process Manager",
  "Calculator",
  "Text Editor"
);
$query = $_POST['query'];
// list of apps...
$apps = Files::getInstance("../apps")->dir();
foreach ($apps as $app) {
  $name = $app['base'];
  $simplename = str_replace(".ap","",$name);
  $icon = "/apps/".str_replace(" ","\ ",$name)."/icon/64.png";
  if(!file_exists("../apps/$name/icon/64.png"))$icon = "/res/icons/app.svg";
  $info = json_decode(file_get_contents("../apps/$name/manifest.json"),true);
  if((!$query && in_array(str_replace(".ap","",$name),$filter)) || ($query && $simplename === $query && !$info['service'])) {
    if($query)$opening = " opening";
    echo "<div class='app-item$opening' id='".uniqid()."' tooltip='{$info['name']}' onclick='apps.show(&quot;$simplename&quot;),apps.open(&quot;$simplename&quot;);' style='background-image:url($icon);'></div>";
  }
}
