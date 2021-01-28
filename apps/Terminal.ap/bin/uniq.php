<?php
if($args[0] === "f") {
?>
<script>
var guid = main.system.guid();
$(".backlog ul").append("<li class='response'>"+guid+"</li>");
</script>
<?php
} else $return .= uniqid();
