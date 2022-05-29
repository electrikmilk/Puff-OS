<div class="pages">
	<?php
	$papes = Files::dir($_SERVER['DOCUMENT_ROOT'] . "/res/wallpapers", false);
	foreach ($papes as $pape) {
		echo "<div onclick='set_wallpaper(\"/res/wallpapers/{$pape['name']}\");'><img src='/res/wallpapers/{$pape['name']}' width='100%'/></div>";
	}
	?>
</div>
