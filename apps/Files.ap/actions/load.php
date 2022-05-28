<?php
$cwd = $_POST['cwd'] ?? '/';
$files = Files::dir($cwd);
$date_format = 'm/d/Y h:i:s';
if ($files) {
	?>
	<table>
		<thead>
		<?php
		$cols = ["Name", "Type", "Size", "Modified", "Created"];
		foreach ($cols as $col) {
			echo "<th>$col</th>";
		}
		?>
		</thead>
		<tbody>
		<?php
		foreach ($files as $file) {
			if (!$file['name']) continue; // not sure why some don't have names
			if (substr($file['name'], 0, 1) === '.') continue; // hide dot files for now
			if ($file['type'] === 'dir') {
				echo "<tr onclick='load(\"$cwd{$file['name']}/\")'>";
			} else {
				echo "<tr onclick='file(\"$cwd{$file['name']}\",\"{$file['mime']}\",\"{$file['ext']}\")'>";
			}
			echo "<td>{$file['name']}</td>";
			echo "<td>" . ($file['mime'] ?? $file['type']) . "</td>";
			echo "<td>{$file['size']}</td>";
			echo "<td>" . date($date_format, $file['last_mod']) . "</td>";
			echo "<td>" . date($date_format, $file['created']) . "</td>";
			echo "</tr>";
		}
		?>
		</tbody>
	</table>
	<?php
} else {
	echo "could not load $cwd";
}