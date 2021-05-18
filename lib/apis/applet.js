/* Applet API */
console.time("window.load");
var frameworks = ["jquery"];
var apis = ["cursor"];
var timeout = 1000;
var main = null;
if (parent.system) main = parent;

var Import = {
  file: function(url) {
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
    applet.log("imported " + url + "...");
  },
  font: function(name) {
    var url = "https://fonts.googleapis.com/css2?family=" + name + ":wght@400;500;700&display=swap";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        let css = xhr.responseText;
        css = css.replace(/}/g, 'font-display: swap; }');
        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        head.appendChild(style);
        $("head").append("<style>html,body,button,select,input,textarea{font-family:" + name + ";}</style>");
        applet.log("loaded font '" + name + "'");
      } else if (xhr.status !== 200) app.log("font '" + name + "' does not exist", "error", xhr);
    };
    xhr.send();
  }
}

var applet; // define app instance

window.onload = function() {
  console.timeEnd("window.load");
  if (!main) console.warn("running in solo mode");
  if (!manifest.name || !manifest.version) {
    if (main) main.main.log("Applet error: no name or version!", "error");
  } else {
    appTitle = manifest.name;
    console.info("Creating applet for '" + manifest.name + "' (" + manifest.version + ")...");
    if (main) {
      main.processes.forEach(function(item) {
        if (item.name === manifest.name + " Applet") {
          applet = main.processes[main.processes.indexOf(item)];
        }
      });
    }
    // frameworks (external)
    frameworks.forEach(function(item) {
      setTimeout(function() {
        Import.file("/lib/frameworks/" + item + ".min.js");
      }, timeout);
      timeout = timeout + 300;
    });
    // apis (internal)
    apis.forEach(function(item) {
      setTimeout(function() {
        Import.file("/lib/apis/" + item + ".js");
      }, timeout);
      timeout = timeout + 300;
    });
    // interface
    Import.file("/lib/applet.css");
    Import.file("/lib/gui.css");
    setTimeout(function() {
      // system font
      Import.font("Signika");
      $("body").attr("style", "");
      $("form").on("submit", function(event) {
        event.preventDefault();
      });
      $(window).on("mousedown, mouseup, click", function() {
        main.apps.showWindow(applet.id);
      });
      // app files
      Import.file("/apps/" + manifest.name + ".ap/index.css");
      Import.file("/apps/" + manifest.name + ".ap/applet/index.js");
    }, 2000);
  }
};