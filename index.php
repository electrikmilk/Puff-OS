<?php
require_once "globals.php";
require_once "lib/php/flush.php";
?>
<!doctype html>
<html>
<head>
	<title>Loading...</title>
	<link rel="icon" href="/res/logo.png"/>
</head>
<body style="background-color:black;">
<div class="system-audio"></div>

<div class="in-popup">
	<button onclick="openWindow();">Open Puff OS</button>
	<p>Nothing happening? Allow popups.</p>
</div>

<div class="screenshot"></div>

<div class="boot" style='text-align: center;'>
	<div>
		<img class="reaction" width="60"/>
		<p style="color:white;"></p>
	</div>
</div>
<div class="desktop-container" style="display: none;">
	<div class="dialogs-container"></div>
	<div class="windows-container"></div>
	<div class="menubar-container">
		<div class="system-menu menubar-menu-container">
			<div class="menubar-label menubar-label-icon"></div>
			<div class="menubar-menu">
				<ul></ul>
			</div>
		</div>
		<div class="app-menus"></div>
		<div class="applets">
			<div class="applet clock">00:00:00</div>
		</div>
	</div>
</div>
<div class="login-container" style="display: none;">
	<!-- <div class="login-window">
	  <form id="login-form">
		<h3>Please Login</h3>
		<p>After you login you will be able to access your files, desktop, etc.</p>
		<div><input type="email" id="login-email" name="login-email" placeholder="Email address..."/></div>
		<div><input type="password" id="login-password" name="login-password" placeholder="Password..."/></div>
		<div>
		  <label for="login-remember">Remember me</label>
		  <input type="checkbox" id="login-remember" name="login-remember"/>
		</div>
		<button type="submit" class="primary">Login</button>
		<button type="submit" onclick="system.login();">Debug</button>
	  </form>
	</div> -->
</div>
<script type="text/javascript" src="lib/init.js" defer></script>
</body>
</html>
