<?php
// list of apps...
$apps = Files::getInstance("../apps")->list();
foreach ($apps as $app) {
  $info = json_decode(file_get_contents("../apps/$app/manifest.json"),true);
  echo "<div class='app-item' id='".uniqid()."' onclick='apps.open(&quot;".str_replace(".ap","",$app)."&quot;);' title='{$info['name']}' style='background-image:url(/apps/".str_replace(" ","\ ",$app)."/icon/64.png);'></div>";
}
