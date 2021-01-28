<?php
$app = $args[0];
$return = "trying to kill '$app'..."; ?>
<script>main.apps.close("<?php echo $app; ?>");</script>
