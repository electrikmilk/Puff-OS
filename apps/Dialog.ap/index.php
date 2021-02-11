<?php
$title = $_GET['title'];
$message = $_GET['message'];
$ok = $_GET['ok'];
$cancel = $_GET['cancel'];
$callback = $_GET['callback'];
$cancelback = $_GET['cancelcallback'];
if(!$button)$button = "OK";
if(!$cancel)$cancel = "Cancel";
if($callback)$callback = "main.$callback";
if($cancelback)$cancelback = "main.$cancelback";
?>
<h3 class="dialog-title"><?php echo $title; ?></h3>
<p class="dialog-message"><?php echo $message; ?></p>
<div class="dialog-buttons">
  <button type="submit" class="primary ok-btn" onclick="<?php echo $callback; ?>"><?php echo $button; ?></button>
  <?php if($_GET['cancel'] !== "false")echo "<button type='submit' class='cancel-btn' onclick='$cancelback'>$cancel</button>"; ?>
</div>
