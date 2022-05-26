<div class="pages">
	<?php
	$papes = Files::dir("../../../res/wallpapers", false);
	foreach ($papes as $pape) {
		echo "<div onclick='set_wallpaper(\"/res/wallpapers/{$pape['base']}\");'><img src='/res/wallpapers/{$pape['base']}' width='100%'/></div>";
	}
	?>
</div>
