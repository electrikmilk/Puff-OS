<div class="app">
<?php
$app_name = $_GET['name'];
if(!$app_name) {
  ?>
  <img src="/res/logo.png" width="64"/>
  <h3 id="name"></h3>
  <p id="version"></p>
  <p>
  <?php
} else {
  $manifest = "../../apps/$app_name.ap/manifest.json";
  if(file_exists($manifest)) {
    $manifest = json_decode(file_get_contents($manifest),true);
    $icon = "/apps/$app_name.ap/icon/512.png";
    if(!file_exists("../../apps/$app_name.ap/icon/512.png"))$icon = "/res/icons/app.svg";
    ?>
    <img src="<?php echo $icon; ?>" width="64"/>
    <h3><?php echo $manifest['name']; ?></h3>
    <p>Version <?php echo $manifest['version']; ?></p>
    <?php
  } else echo "<p>App '$app_name' has not provided or has incorrect syntax in it's manifest.</p>";
}
?>
</div>
<hr/>
<form id="report-form">
  <input type="hidden" name="name" value="<?php echo $manifest['name']; ?>"/>
  <input type="hidden" name="version" value="<?php echo $manifest['version']; ?>"/>
  <textarea name="message" placeholder="Please include as many details as you can..." class="stretch" style="height: 150px;"></textarea>
  <p><b>Never</b> include any sensitive information, account details, or possible security vulnerabilities in the field above.</p>
  <div class="dialog-buttons">
    <button type="submit" class="primary">Submit</button>
  </div>
</form>
