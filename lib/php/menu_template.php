<?php
$id = $_POST['id'];
$app_name = $_POST['name'];
$manifest = "../apps/$app_name.ap/manifest.json";
if(file_exists($manifest)) {
  $info = json_decode(file_get_contents($manifest),true);
  $title = $info['name'];
  $menus = array();
  if($info['name'] !== "About")array_push($menus,
    array("<b>$title</b>"=>array(
      "About $title"=>array(
        "onClick"=>"apps.about(&quot;$title&quot;)"
      ),
      "New $title"=>array(
        "onClick"=>"apps.open(&quot;$title&quot;,true)",
        "divider"=>true
      ),
      "Quit $title"=>array(
        "onClick"=>"apps.close(&quot;$id&quot;)"
      )
    ))
  );
  if($info['menus'])array_push($menus,$info['menus']);
  echo "<div class='app-menu' data-app='$title' id='menu-$id'>";
  foreach ($menus as $menu) {
    foreach ($menu as $title => $items) {
    ?>
    <div class="menubar-menu-container">
      <div class="menubar-label"><?php echo $title; ?></div>
      <div class="menubar-menu">
        <ul>
          <?php
          foreach ($items as $label => $opt) {
            $item_label = str_replace("%name",$manifest['name'],$label);
            $onclick = str_replace("%name",$manifest['name'],$opt['onClick']);
            echo "<li onclick='$onclick'>$item_label</li>";
            if($opt['divider'])echo "<hr/>";
          }
          ?>
        </ul>
      </div>
    </div>
    <?php
    }
  }
  echo "</div>";
} else return;
