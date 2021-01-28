<?php
$app = $_REQUEST['app'];
$info = json_decode(file_get_contents("../../apps/$app.ap/manifest.json"),true);
?>
<!doctype html>
<html>
<head>
  <title><?php echo $info['name']; ?></title>
  <script type="text/javascript" src="/lib/apis/app.js"></script>
  <script>var appVersion = "<?php echo $info['version']; ?>";</script>
</head>
<body style="opacity:0;background:black;pointer-events:none;user-select:none;">
  <?php
  if($info['index'])$index = $info['index'];
  else $index = "index.html";
  $path = "../../apps/$app.ap/$index";
  if(file_exists($path)) {
    $ext = pathinfo($path,PATHINFO_EXTENSION);
    if($ext === "php")echo include_once $path;
    else echo file_get_contents($path);
  } else echo "<script>
  parent.desktop.log('$app.ap DOM not found! Closing...','warn');
  // apps.close('$app');
  </script>";
  ?>
</body>
</html>
