<?php
$file = $_POST['file'];
if($file && file_exists($file))$contents = file_get_contents($file);
?>
<div class="app-toolbar">
  <button onclick="update();">Update</button>
</div>
<div class="split-editor">
  <textarea><?php echo $contents; ?></textarea>
  <iframe frameborder=0></iframe>
</div>
