<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);

$cwd = "/";
if ($_GET['cwd']) {
	$cwd = $_GET['cwd'];
}
$files = Files::dir($cwd);
?>
<div class="app-toolbar">
	<button type="submit" onclick="">Back</button>
	<button type="submit" onclick="">Forward</button>
	<button type="submit" onclick="">Up</button>
</div>
<table>
	<thead>
	<?php
	$cols = ["Name"];
	foreach ($cols as $col) {
		echo "<th>$col</th>";
	}
	?>
	</thead>
	<tbody>
	<?php
	foreach ($files as $file) {
		echo "<tr>";
		if ($file['type'] === 'dir') {
			echo "<td><a href='?app&=Files&cwd=$cwd{$file['name']}'>{$file['name']}</a></td>";
		} else {
			echo "<td>{$file['name']}</td>";
		}
		echo "</tr>";
	}
	//	if ($handle = opendir($cwd)) {
	//		while (false !== ($entry = readdir($handle))) {
	//			if ($entry != "." && $entry != "..") {
	//				echo "<tr><td>$entry</td></tr>";
	//			}
	//		}
	//		closedir($handle);
	//	}
	?>
	</tbody>
</table>