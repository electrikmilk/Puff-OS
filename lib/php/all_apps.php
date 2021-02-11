<hr/>
<?php
$apps = Files::getInstance("../apps")->dir();
foreach ($apps as $app) {
  $name = $app['base'];
  $simplename = str_replace(".ap","",$name);
  $icon = "/apps/$name/icon/16.png";
  if(!file_exists("../apps/$name/icon/16.png"))$icon = "/res/icons/app.svg";
  $info = json_decode(file_get_contents("../apps/$name/manifest.json"),true);
  if(!$info['service'])echo "<li onclick='apps.show(&quot;$simplename&quot;),apps.open(&quot;$simplename&quot;);'><img src='$icon' width='16' height='16' class='window-icon'/><span style='margin-left: 3px;'>{$info['name']}</span></li>";
}
