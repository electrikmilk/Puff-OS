<?php
$path = "../../{$_GET['path']}";
$info = pathinfo($path);
$ext = $info['extension'];
$audio = array("mp3","wav","aiff");
if (!file_exists($path)) {
    echo "<br/><center><p>File does not exist!</p><p>File: $path</p></center>";
} else {
    ?>
  <script>
  var file = "<?php echo $path; ?>";
  </script>
  <?php
if (in_array($ext, $audio)) {
        ?>
  <div>
    <button type="submit" class="play">Play</button>
    <button type="submit" class="pause">Pause</button>
    <button type="submit" class="stop">Stop</button>
    <input type="range" min="0" max="1" step="0.1" class="volume"/>
  </div>
  <?php
    } else {
        echo "Unsupported (".basename($path).")";
    }
}
