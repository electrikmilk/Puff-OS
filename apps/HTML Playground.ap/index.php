<?php
$file = $_GET['path'];
if ($file && file_exists($file)) {
	$contents = file_get_contents($file);
} else {
	$contents = "<h1>Hello, World!</h1>";
}
?>
<div class="split-editor">
	<textarea><?php echo $contents; ?></textarea>
	<iframe frameborder=0></iframe>
</div>
