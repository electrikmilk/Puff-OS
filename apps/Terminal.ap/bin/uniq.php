<?php
$command = new Command();
if ($args[0] === "f"):
	$command->code("$('.backlog ul').append('<li class=\'response\'>' + main.system.guid() + '</li>');");
else :
	$command->output(uniqid('', true));
endif;
