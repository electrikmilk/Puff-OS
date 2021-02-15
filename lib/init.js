// // Enter fullscreen popup
// if (window.opener && window.opener !== window) {
//   var requestFullscreen = setInterval(function() {
//     if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
//       clearInterval(requestFullscreen);
//     } else {
//       fullscreen(document.documentElement);
//     }
//   }, 2500);
// } else {
//   document.querySelector(".in-popup").style.display = "flex";
//   window.open(window.location.href, 'view', 'menubar=0,statusbar=0');
//   window.stop();
// }

var version = "alpha 0.0.1";
var build = "1";
var osname = "Puff OS";
var clipText;
var processes = [];
var apis = ["network", "files", "device", "audio", "system", "cursor", "clock", "video"];
var frameworks = ["jquery", "jquery-ui", "bootstrap", "mousetrap"];
var timeout = 1000;

console.time("startup");
console.time("window.load");
console.time("uptime");

function importfile(url) {
  if (url.includes("js")) {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", url);
    head.appendChild(script);
  } else {
    const head = document.getElementsByTagName('head')[0];
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute("rel", "stylesheet");
    stylesheet.setAttribute("href", url);
    head.appendChild(stylesheet);
  }
  console.log("imported " + url + "...");
}

function fullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

window.onload = function() {
  console.timeEnd("window.load");
  console.info("version: " + version + ", build: " + build);
  // interface
  importfile("lib/main.css");
  importfile("lib/gui.css");
  // frameworks (external)
  frameworks.forEach(function(item) {
    setTimeout(function() {
      importfile("lib/frameworks/" + item + ".min.js");
    }, timeout);
    timeout = timeout + 300;
  });
  // apis (internal)
  apis.forEach(function(item) {
    setTimeout(function() {
      importfile("lib/apis/" + item + ".js");
    }, timeout);
    timeout = timeout + 300;
  });
}