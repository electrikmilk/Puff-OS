<?php
$app_name = $_POST['name'];
$manifest = "../apps/$app_name.ap/manifest.json";
if(file_exists($manifest)) {
  $info = json_decode(file_get_contents($manifest),true);
  $title = $info['name'];
  if($info['title'])$title = $info['title'];
  if(!$info['sbin'])$sandbox = "sandbox='allow-same-origin allow-scripts allow-popups allow-forms'";
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
    foreach($_POST['data'] as $key => $val) {
      $data[$key] = "$key=$val";
    }
    $data = "&".implode("&",$data);
  }
  $icon = "/apps/$app_name.ap/icon/32.png";
  if(!file_exists("../apps/$app_name.ap/icon/32.png"))$icon = "/res/icons/app.svg";
  ?>
  <div class="window ui-selected" id="<?php echo $_POST['id']; ?>" data-title="<?php echo $app_name; ?>" style="<?php echo $style; ?>">
    <div class="window-bar">
      <div></div>
      <div class="window-title">
        <?php
        if($info['title'] !== false)echo "<div><img src='$icon' width='20' height='20' class='window-icon'/><div>$title</div></div>";
        ?>
      </div>
      <div>
        <?php
        if($info['min'] !== false)echo "<div class='window-btn window-min'><span></span></div>";
        if($info['close'] !== false)echo "<div class='window-btn window-close'><span></span></div>";
        ?>
      </div>
    </div>
    <div class="window-content"><iframe src="/lib/php/app_template?app=<?php echo $app_name.$data; ?>" <?php echo $sandbox; ?> frameborder=0 allowtransparency></iframe></div>
  </div>
  <?php
} else return;
