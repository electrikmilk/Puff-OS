<?php
$id = $_POST['id'];
$app_name = $_POST['name'];
$manifest = "../apps/$app_name.ap/manifest.json";
if(file_exists($manifest)) {
  $info = json_decode(file_get_contents($manifest),true);
  $title = $info['name'];
  $menus = array();
  if(!$info['service'])array_push($menus,
    array("<b>$title</b>"=>array(
      "About $title"=>array(
        "onclick"=>"apps.about(&quot;$title&quot;)"
      ),
      "Reload $title"=>array(
        "onclick"=>"apps.refresh(&quot;$id&quot;,true)",
        "divider"=>true
      ),
      "New $title"=>array(
        "onclick"=>"apps.open(&quot;$title&quot;,true)",
        "divider"=>true
      ),
      "Quit $title"=>array(
        "onclick"=>"apps.close(&quot;$id&quot;)"
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
            unset($onclick,$function);
            $item_label = str_replace("%name",$manifest['name'],$label);
            if($opt['onclick'])$onclick = "onclick='".str_replace("%name",$manifest['name'],str_replace("'","&quot;",$opt['onclick']))."'";
            else if($opt['function'])$function = 'data-function="'.$opt['function'].'"';
            echo "<li $onclick $function>$item_label</li>";
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
