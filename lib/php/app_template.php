<?php
require_once '../../globals.php';
$app = $_REQUEST['app'];
$manifest = PUFF_DIR . "/apps/$app.ap/manifest.json";
if (!file_exists($manifest)) {
	die("Unable to load manifest! ($manifest)");
}
$manifest = json_decode(file_get_contents($manifest), true);
if ($manifest['title'] !== false) {
	$title = $manifest['name'];
}
define('APP_NAME', $app);
define('APP_DIR', PUFF_DIR . "/apps/$app.ap/");
?>
<!doctype html>
<html>
<head>
	<title><?php echo $title; ?></title>
	<script type="text/javascript" src="/lib/apis/app.js"></script>
	<script>
		let manifest = <?php echo file_get_contents("../../apps/$app.ap/manifest.json"); ?>;
	</script>
	<?php
	foreach ($manifest['include'] as $include) {
		$path = "/apps/$app.ap/";
		if (stripos($include, "js")) {
			echo "<script type='text/javascript' src='$path$include' defer></script>";
		} else {
			echo "<link rel='stylesheet' href='$path$include'/>";
		}
	}
	?>
</head>
<body style="opacity:0;background:black;pointer-events:none;user-select:none;">
<div class="dialogs-container">
	<div class="dialog">
		<h3 class="dialog-title"></h3>
		<p class="dialog-message"></p>
		<form>
			<div class="dialog-input">
				<input type="text" class="dialog-input-textbox" autocomplete="off"/>
			</div>
			<div class="dialog-buttons">
				<button type="submit" class="primary dialog-confirm">OK</button>
				<button type="submit" class="dialog-cancel">Cancel</button>
			</div>
		</form>
	</div>
</div>
<?php
if ($manifest['index']) {
	$index = $manifest['index'];
} else {
	$index = "index.html";
}
$path = "../../apps/$app.ap/$index";
if (file_exists($path)) {
	$ext = pathinfo($path, PATHINFO_EXTENSION);
	if ($ext === "php") {
		include_once $path;
	} else {
		echo file_get_contents($path);
	}
} else {
	?>
	<script type="text/javascript">
		parent.main.log('<?=$app?>.ap DOM not found!', 'warn');
	</script>
	<?php
}
?>
</body>
</html>