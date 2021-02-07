<?php
$app = $_REQUEST['app'];
$info = json_decode(file_get_contents("../../apps/$app.ap/manifest.json"),true);
if($info['title'] !== false)$title = $info['name'];
?>
<!doctype html>
<html>
<head>
  <title><?php echo $title; ?></title>
  <script type="text/javascript" src="/lib/apis/app.js"></script>
  <script>
  var appTitle = "<?php echo $info['name']; ?>";
  var appVersion = "<?php echo $info['version']; ?>";
  </script>
</head>
<body style="opacity:0;background:black;pointer-events:none;user-select:none;">
  <div class="dialogs-container">
    <div class="dialog">
      <h3 class="dialog-title"></h3>
      <p class="dialog-message"></p>
      <div class="dialog-input">
          <input type="text" id="dialog-input-textbox"/>
      </div>
      <div class="dialog-buttons">
        <button type="submit" class="primary dialog-confirm">OK</button>
        <button type="submit" class="dialog-cancel">Cancel</button>
      </div>
    </div>
  </div>
  <?php
  if($info['index'])$index = $info['index'];
  else $index = "index.html";
  $path = "../../apps/$app.ap/$index";
  if(file_exists($path)) {
    $ext = pathinfo($path,PATHINFO_EXTENSION);
    if($ext === "php")include_once $path;
    else echo file_get_contents($path);
  } else echo "<script>
  parent.desktop.log('$app.ap DOM not found! Closing...','warn');
  // apps.close('$app');
  </script>";
  ?>
</body>
</html>
