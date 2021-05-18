<!-- TODO: Use Files class instead -->
<table>
<?php
$path = '../../users/anon'; // default
if ($handle = opendir($path)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            echo "<tr><td>$entry</td></tr>";
        }
    }
    closedir($handle);
}
?>
</table>
