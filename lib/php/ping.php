<?php
$url = $_POST['url'];
if (stripos($url, "http") !== false && filter_var($url, FILTER_VALIDATE_URL)) {
	$contents = file_get_contents($url);
	if ($contents) {
		echo $contents;
	}
}
echo "not a valid url";
