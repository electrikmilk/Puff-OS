<?php
$path = "../../{$_GET['path']}";
$info = pathinfo($path);
$ext = $info['extension'];
$audio = array("mp3","wav","aiff");
$image = array("jpg","jpeg","png","gif");
$video = array("mp4","avi","flv","mov","m4a");
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
        <script>
        var type = "audio";
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
      var type = "image";
      </script>
      <div class="image" style="background-image:url(<?php echo $path; ?>);"></div>
      <?php
    } elseif (in_array($ext, $video)) {
        ?>
        <script>
        var type = "video";
        </script>
        <video src='<?php echo $path; ?>' controls></video>
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
