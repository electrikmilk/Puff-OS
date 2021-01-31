<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);
require_once "globals.php";
require_once "lib/php/flush.php";
?>
<!doctype html>
<html>
<head>
  <title>Loading...</title>
</head>
<body style="background-color:black;">
<div class="system-audio"></div>

<div class="tests">
  <div style="height: 150px;width: 200px;border: 1px solid white;overflow: auto;"><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/></div><br/>
  <div><input type="text" placeholder="Placeholder..."/></div><br/>
  <div><input type="email" placeholder="Email address..."/></div><br/>
  <div><input type="password" placeholder="Password..."/></div><br/>
  <div>
    <select>
      <option>option</option>
    </select>
  </div><br/>
  <div><textarea placeholder="sample textarea..."></textarea></div><br/>
  <div>
    <button type="submit">Default</button>
    <button type="submit" class="primary">Primary</button>
    <button type="submit" class="caution">Secondary</button>
  </div>
</div>

<div class="boot"><div class='loader'></div></div>
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
    <div class="clock">00:00:00</div>
  </div>
  <div class="toolbar-container"></div>
</div>
<div class="login-container" style="display: none;">
  <div class="login-window">
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
  </div>
</div>
<script type="text/javascript" src="lib/init.js" defer></script>
</body>
</html>
