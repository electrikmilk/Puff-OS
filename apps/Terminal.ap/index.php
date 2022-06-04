<?php
$sessions = Files::sort(Files::dir(APP_DIR . "sessions"), Sort::DATE_M, Order::DESC);
$timestamp = date('Y-m-d H:i:s', $sessions[0]['last_mod']);
echo "Last session: $timestamp<hr/>";
?>
<div class="backlog">
	<ul></ul>
</div>
<table>
	<tr>
		<td><span id="signature"></span></td>
		<td>
			<form id="terminal">
				<input type="text" autofocus/>
			</form>
		</td>
	</tr>
</table>