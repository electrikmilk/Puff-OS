<?php
$app_name = $_GET['name'];
if(!$app_name) {
  ?>
  <img src="/res/logo.png" width="64"/>
  <p id="name"></p>
  <p id="version"></p>
  <p>A web desktop</p>
  <p>
  <?php
} else {
  $manifest = "../../apps/$app_name.ap/manifest.json";
  if(file_exists($manifest)) {
    $manifest = json_decode(file_get_contents($manifest),true);
    ?>
    <img src="/apps/<?php echo $app_name; ?>.ap/icon/512.png" width="64"/>
    <p><b><?php echo $manifest['name']; ?></b></p>
    <p>Version <?php echo $manifest['version']; ?></p>
    <p><?php echo $manifest['about']; ?></p>
    <?php
    // if($manifest['sbin'])echo "<p><i>This is a system app.</i></p>";
  } else echo "<p>App '$app_name' has not provided or has incorrect syntax in it's manifest.</p>";
}
