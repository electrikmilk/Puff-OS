<?php
if($args[0]) {
  if($args[0] === "count")$return = "Number of items stored cache:";
  else if($args[0] === "purge")$return = "purged cache";
  else return;
  if($args[0] === "count") {
    ?>
    <script>$(".backlog ul").append("<li class='response'>" + main.system.cache.<?php echo $args[0]; ?>() + "</li>");</script>
    <?php
  }
}
