<?php
$app_name = $_POST['name'];
$manifest = "../apps/$app_name.ap/manifest.json";
if(file_exists($manifest)) {
  $info = json_decode(file_get_contents($manifest),true);
  $title = $info['name'];
  if(!$info['sbin'])$sandbox = "sandbox='allow-same-origin allow-scripts allow-popups allow-forms'";
  $style = array();
  if(!$info['inline'])$style["display"] = "none"; // hide the window initally, this way only shown when ready
  if($info['width'])$style["width"] = $info['width'];
  if($info['height'])$style["height"] = $info['height'];
  if($info['x'])$style["left"] = $info['x'];
  if($info['y'])$style["top"] = $info['y'];
  if($info['center']){
    $style["left"] = "50%";
    $style["top"] = "50%";
    $style["transform"] = "translate(-50%, -50%)";
  }
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
        if($info['title'] !== false) {
          if($info['title'])$title = $info['title'];
          echo "<div><img src='$icon' width='20' height='20' class='window-icon'/><div>$title</div></div>";
        }
        ?>
      </div>
      <div>
        <?php
        if($info['min'] !== false && $info['service'] !== true)echo "<div class='window-btn window-min'><span></span></div>";
        if($info['close'] !== false)echo "<div class='window-btn window-close'><span></span></div>";
        ?>
      </div>
    </div>
    <div class="window-content">
      <?php
      if($info['inline'] === true) {
        if($info['index'])$index = $info['index'];
        else $index = "index.html";
        $path = "../../apps/$app.ap/$index";
        $ext = pathinfo($path,PATHINFO_EXTENSION);
        if($ext === "php")include_once $path;
        else echo file_get_contents($path);
      } else {
      ?>
      <iframe src="/lib/php/app_template?app=<?php echo $app_name.$data; ?>" <?php echo $sandbox; ?> frameborder=0 allowtransparency></iframe>
      <?php
      }
      ?>
    </div>
  </div>
  <?php
} else return;
