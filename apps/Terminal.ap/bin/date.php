<?php
if (count($args)) {
	if ($args[0] === 'utc') {
		$return = date('c');
	}
} else {
	$return = date('Y-m-d H:i:s');
}