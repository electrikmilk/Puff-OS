<?php
$info = json_decode(file_get_contents("../../apps/$app_name.ap/manifest.json"), true);
if ($info['title'] !== false) {
	$title = $info['name'];
}
?>
<!doctype html>
<html>
<head>
	<title><?php echo $title; ?></title>
	<script type="text/javascript" src="/lib/apis/app.js"></script>
	<script>
		let appTitle = "<?php echo $info['name']; ?>";
		let appVersion = "<?php echo $info['version']; ?>";
	</script>
</head>
<body style="opacity:0;background:black;pointer-events:none;user-select:none;">
<?php
if ($info['index']) {
	$index = $info['index'];
}
else {
	$index = "index.html";
}
$path = "../../apps/$app_name.ap/$index";
if (file_exists($path)) {
	$ext = pathinfo($path, PATHINFO_EXTENSION);
	if ($ext === "php") {
		include_once $path;
	}
	else {
		echo file_get_contents($path);
	}
} else {
	echo "<script>
  parent.desktop.log('$app_name.ap DOM not found! Closing...','warn');
  // apps.close('$app_name');
  </script>";
}
?>
</body>
</html>
