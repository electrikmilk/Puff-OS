<?php
if ($args[0] === "f"):
	?>
	<script>
		let guid = main.system.guid();
		$(".backlog ul").append("<li class='response'>" + guid + "</li>");
	</script>
<?php
else :
	$return .= uniqid();
endif;
