<div class="pages">
  <?php
  require_once "../../../lib/apis/application.php";
  $files = Files::getInstance("../../../res/wallpapers",false);
  foreach($files->dir() as $wp) {
    echo "<div onclick='setWP(&quot;/res/wallpapers/{$wp['base']}&quot;);'><img src='/res/wallpapers/{$wp['base']}' width='100%'/></div>";
  }
  ?>
</div>
