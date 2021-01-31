<?php
$app_name = $_POST['name'];
$manifest = "../apps/$app_name.ap/manifest.json";
if(file_exists($manifest)) {
  $info = json_decode(file_get_contents($manifest),true);
  $title = $info['name'];
  if($info['title'])$title = $info['title'];
  if(!$info['sbin'])$sandbox = "sandbox";
  $style = array();
  $style["display"] = "none"; // hide the window initally, this way only shown when ready
  if($info['width'])$style["width"] = $info['width'];
  if($info['height'])$style["height"] = $info['height'];
  if($info['x'])$style["left"] = $info['x'];
  if($info['y'])$style["top"] = $info['y'];
  foreach($style as $param => $val) {
    $style[$param] = "$param:$val";
  }
  $style = implode(";",$style);
  if($_POST['data']) {
    // $data = json_decode($_POST['data'],true);
    foreach($_POST['data'] as $key => $val) {
      $data[$key] = "$key=$val";
    }
    $data = "&".implode("&",$data);
  }
  ?>
  <div class="window ui-selected" id="<?php echo $_POST['id']; ?>" data-title="<?php echo $title; ?>" style="<?php echo $style; ?>">
    <div class="window-bar">
      <div></div>
      <div class="window-title">
        <?php
        if($info['title'] !== false)echo "<div><img src='/apps/$app_name.ap/icon/32.png' width='16' height='16' class='window-icon'/><div>$title</div></div>";
        ?>
      </div>
      <div>
        <?php
        if($info['close'] !== false)echo "<div class='window-btn window-close'>&times;</div>";
        if($info['min'] !== false)echo "<div class='window-btn window-min'>-</div>";
        ?>
      </div>
    </div>
    <div class="window-content"><iframe src="/lib/php/app_template?app=<?php echo $app_name.$data; ?>" <?php echo $sandbox; ?> frameborder=0 allowtransparency></iframe></div>
  </div>
  <?php
} else return;
