<?php
$filter = array(
  "Report Bug",
  "Settings",
  "Screenshot",
  "About"
);

// list of apps...
$apps = Files::getInstance("../apps")->dir();
foreach ($apps as $app) {
  $name = $app['base'];
  $simplename = str_replace(".ap","",$name);
  $info = json_decode(file_get_contents("../apps/$name/manifest.json"),true);
  if(!in_array(str_replace(".ap","",$name),$filter)) {
    echo "<div class='app-item' id='".uniqid()."' tooltip='{$info['name']}' onclick='apps.show(&quot;$simplename&quot;),apps.open(&quot;$simplename&quot;);' style='background-image:url(/apps/".str_replace(" ","\ ",$name)."/icon/64.png);'></div>";
  }
}
