<?php
$app = $_REQUEST['app'];
$info = json_decode(file_get_contents("../../apps/$app.ap/manifest.json"), true);
if ($info['title'] !== false) {
	$title = $info['name'];
}
?>
<!doctype html>
<html>
<head>
	<title><?php echo $title; ?> (Applet)</title>
	<script type="text/javascript" src="/lib/apis/applet.js"></script>
	<script>
		let manifest = <?php echo json_encode(json_decode(file_get_contents("../../apps/$app.ap/manifest.json"))); ?>;
	</script>
</head>
<body style="pointer-events:none;user-select:none;">
<?php
$path = "../../apps/$app.ap/applet/index.html";
if (file_exists($path)) {
	echo file_get_contents($path);
} else {
	?>
	<script type="text/javascript">
		parent.main.log('<?=$app?>.ap applet DOM not found!', "warn");
	</script>
	<?php
}
?>
</body>
</html>
