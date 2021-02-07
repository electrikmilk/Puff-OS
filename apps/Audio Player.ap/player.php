<?php
$file = $_GET['file'];
if(!$file)$file = "../../res/sounds/thing.mp3";
if(!file_exists($file))echo "<br/><center><p>Cannot play file. It doesn't exist.</p><p>File: $file</p></center>";
else {
  ?>
  <script>
  var file = "<?php echo $file; ?>";
  </script>
  <div>
    <button type="submit" class="play">Play</button>
    <button type="submit" class="pause">Pause</button>
    <button type="submit" class="stop">Stop</button>
  </div>
  <?php
}
