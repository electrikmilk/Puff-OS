<?php
$audio = ["mp3", "wav", "aiff"];
$image = ["jpg", "jpeg", "png", "gif"];
$video = ["mp4", "avi", "flv", "mov", "m4a"];
$path = $_GET['path'];
if (!file_exists($path)) {
	echo "<br/><center><p>File does not exist!</p><p>File: $path</p></center>";
} else {
	$info = pathinfo($path);
	$ext = strtolower($info['extension']);
	$mime = mime_content_type($path);
	$path = "data:$mime;base64," . base64_encode(file_get_contents($path));
	if (in_array($ext, $audio)) {
		?>
		<script>
			type = 'audio';
		</script>
		<div>
			<button type="submit" class="play">Play</button>
			<button type="submit" class="pause">Pause</button>
			<button type="submit" class="stop">Stop</button>
			<input type="range" min="0" max="1" step="0.1" class="volume"/>
		</div>
		<?php
	} elseif (in_array($ext, $image)) {
		?>
		<script>
			type = 'image';
		</script>
		<div class="image" style="background-image:url(<?= $path ?>);"></div>
		<?php
	} elseif (in_array($ext, $video)) {
		?>
		<script>
			type = 'video';
		</script>
		<video src='<?= $path; ?>' controls></video>
		<div>
			<button type="submit" class="play">Play</button>
			<button type="submit" class="pause">Pause</button>
			<button type="submit" class="stop">Stop</button>
			<input type="range" min="0" max="1" step="0.1" class="volume"/>
		</div>
		<?php
	} else {
		echo "Unsupported (" . basename($path) . ")";
	}
}
