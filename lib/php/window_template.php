<?php
$app_name = $_POST['name'];
$info = json_decode(file_get_contents("../apps/$app_name.ap/manifest.json"),true);
$title = "{$info['name']} ({$info['version']})";
if(!$info['sbin'])$sandbox = "sandbox";
?>
<div class="window" id="<?php echo $_POST['id']; ?>" data-version="<?php echo htmlspecialchars($info['about']); ?>" data-about="<?php echo htmlspecialchars($info['about']); ?>" style="display: none;">
  <div class="window-bar">
    <div></div>
    <div class="window-title"><img src="/apps/<?php echo $app_name; ?>.ap/icon/16.png" class="window-icon"/><div><?php echo $title; ?></div></div>
    <div>
      <div class="window-close">&times;</div>
    </div>
  </div>
  <div class="window-content"><iframe src="/lib/php/app_template?app=<?php echo $app_name; ?>" <?php echo $sandbox; ?> frameborder=0 allowtransparency></iframe></div>
</div>
