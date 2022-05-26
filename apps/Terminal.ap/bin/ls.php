<?php
$escape = false;
$cwd = $session->get('cwd');
$files_object = Files::dir($cwd);
$files = [];
foreach ($files_object as $f) {
	$files[] = $f['name'];
}
$list = "";
foreach ($files as $file) {
	$list .= "<div>$file</div>";
}
$return .= "<div class='shortlist'>$list</div>";