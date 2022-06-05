<?php
$app_name = $_POST['name'];
$manifest = $_SERVER['DOCUMENT_ROOT'] . "/apps/$app_name.ap/manifest.json";
if (!file_exists($manifest)) {
	die("Unable to load manifest! ($manifest)");
}
$manifest = json_decode(file_get_contents($manifest), true);
$title = $manifest['name'];
if (!$manifest['sbin']) {
	$sandbox = "sandbox='allow-same-origin allow-scripts allow-popups allow-forms'";
}
$style = array();
$classes = array();
if (!$manifest['inline']) {
	$style["display"] = "none";
} // hide the window initially, this way only shown when ready
if ($manifest['width']) {
	$style["width"] = $manifest['width'];
}
if ($manifest['height']) {
	$style["height"] = $manifest['height'];
}
if ($manifest['x']) {
	$style["left"] = $manifest['x'];
}
if ($manifest['y']) {
	$style["top"] = $manifest['y'];
}
if ($manifest['center']) {
	// $style["left"] = "50%";
	// $style["top"] = "50%";
	// $style["transform"] = "translate(-50%, -50%)";
	$classes[] = "frontncenter";
}
foreach ($style as $param => $val) {
	$style[$param] = "$param:$val";
}
$style = implode(";", $style);
if ($_POST['data']) {
	foreach ($_POST['data'] as $key => $val) {
		$data[$key] = "$key=$val";
	}
	$data = "&" . implode("&", $data);
}
$icon = "/apps/$app_name.ap/icon/32.png";
if (!file_exists("../apps/$app_name.ap/icon/32.png")) {
	$icon = "/res/icons/app.svg";
} ?>
<div class="window ui-selected <?php echo implode(' ', $classes); ?>" id="<?php echo $_POST['id']; ?>" data-title="<?php echo $app_name; ?>" style="<?php echo $style; ?>">
	<div class="window-bar">
		<div></div>
		<div class="window-title">
			<?php
			if ($manifest['title'] !== false) {
				if ($manifest['title']) {
					$title = $manifest['title'];
				}
				echo "<div><img src='$icon' width='20' height='20' class='window-icon'/><div>$title</div></div>";
			} ?>
		</div>
		<div>
			<?php
			if ($manifest['min'] !== false && $manifest['service'] !== true) {
				echo "<div class='window-btn window-min'><span></span></div>";
			}
			if ($manifest['close'] !== false) {
				echo "<div class='window-btn window-close'><span></span></div>";
			} ?>
		</div>
	</div>
	<div class="window-content">
		<?php
		if ($manifest['inline'] === true) {
			if ($manifest['index']) {
				$index = $manifest['index'];
			} else {
				$index = "index.html";
			}
			$path = "../../apps/$app.ap/$index";
			$ext = pathinfo($path, PATHINFO_EXTENSION);
			if ($ext === "php") {
				include_once $path;
			} else {
				echo file_get_contents($path);
			}
		} else {
			?>
			<iframe src="/lib/php/app_template?app=<?php echo $app_name . $data; ?>" <?php echo $sandbox; ?> frameborder=0 allowtransparency></iframe>
			<?php
		} ?>
	</div>
</div>