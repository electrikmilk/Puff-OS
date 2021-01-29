<?php
$notready = array(
  "About",
  "Browser",
  "Files Manager",
  "Report Bug",
  "Settings"
);

// list of apps...
$apps = Files::getInstance("../apps")->dir();
foreach ($apps as $app) {
  $name = $app['base'];
  $info = json_decode(file_get_contents("../apps/$name/manifest.json"),true);
  if(!in_array(str_replace(".ap","",$name),$notready)) {
    echo "<div class='app-item' id='".uniqid()."' onclick='apps.open(&quot;".str_replace(".ap","",$name)."&quot;);' title='{$info['name']}' style='background-image:url(/apps/".str_replace(" ","\ ",$name)."/icon/64.png);'></div>";
  }
}
