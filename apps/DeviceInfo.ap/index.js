var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};

$(function() {
  $("#osname").html(main.osname);
  $("#version").html(main.version + " (" + main.build + ")");
  // Basic
  // navigator.appVersion, navigator.userAgent
  var info = "<p>System: " + navigator.platform + "</p>";
  info += "<p>Browser: " + navigator.appName + "/" + navigator.appCodeName + "</p>";
  info += "<p>Cookies: " + navigator.cookieEnabled + "</p>";
  info += "<p>Language: " + navigator.language + "</p>";
  $(".basic").html(info);
  // Performance
  if (navigator.getHardwareConcurrency) {
    var perform = "<p>Processor: " + navigator.getHardwareConcurrency.length + " cores</p>";
    if (performance.memory) perform += "<p>Memory: " + main.files.formatBytes(performance.memory.jsHeapSizeLimit) + "</p>";
    else perform += "<p>Memory: Detection not supproted</p>";
    $(".perform").html(perform);
  }
  // Graphics
  var canvas = document.getElementById("glcanvas");
  var gl = canvas.getContext("experimental-webgl");
  var graphics = "<p>Browser Renderer: " + gl.getParameter(gl.RENDERER) + "</p>";
  graphics += "<p>Browser Vendor: " + gl.getParameter(gl.VENDOR) + "</p>";
  graphics += "<p>Hardware Renderer: " + getUnmaskedInfo(gl).renderer + "</p>";
  graphics += "<p>Hardware Vendor: " + getUnmaskedInfo(gl).vendor + "</p>";
  $(".graphics").html("<p>" + graphics + "</p>");
  // Network
  if (navigator.connection) {
    var network = "<p>Connection type: " + navigator.connection.effectiveType + "</p>";
    network += "<p>Online: " + navigator.onLine + "</p>";
    network += "<p>Downlink: " + navigator.connection.downlink + " Mb/s</p>";
  } else var network = "Detection not supported.";
  $(".network").html(network);
  Window.show();
});

function getUnmaskedInfo(gl) {
  var unMaskedInfo = {
    renderer: '',
    vendor: ''
  };
  var dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (dbgRenderInfo != null) {
    unMaskedInfo.renderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
    unMaskedInfo.vendor = gl.getParameter(dbgRenderInfo.UNMASKED_VENDOR_WEBGL);
  }
  return unMaskedInfo;
}

function close() {
  Window.close();
}