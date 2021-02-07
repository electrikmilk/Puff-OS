console.time("window.load");
var frameworks = ["jquery", "jquery-ui", "bootstrap", "mousetrap"];
var apis = ["cursor"];
var timeout = 1000;
var main = null;
if (parent.desktop) main = parent;

var application = {
  title: function(title) {
    title = appTitle + " &mdash; " + title;
    document.title = title;
    $("title").html(title);
    app.log("title: " + title);
  },
  import: function(url) {
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
    app.log("imported " + url + "...");
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
        app.log("loaded font '" + name + "'");
      } else if (xhr.status !== 200) app.log("font '" + name + "' does not exist", "error", xhr);
    };
    xhr.send();
  }
}

var app; // define app instance

window.onload = function() {
  console.timeEnd("window.load");
  if (!main) console.warn("running in solo mode");
  if (!appTitle || !appVersion) {
    if (main) main.desktop.log("App error: no name or version!", "error");
  } else {
    console.info("Running app '" + appTitle + "' (" + appVersion + ")...");
    if (main) {
      main.processes.forEach(function(item) {
        if (item.name === appTitle) {
          app = main.processes[main.processes.indexOf(item)];
        }
      });
    }
    // frameworks (external)
    frameworks.forEach(function(item) {
      setTimeout(function() {
        application.import("/lib/frameworks/" + item + ".min.js");
      }, timeout);
      timeout = timeout + 200;
    });
    // apis (internal)
    apis.forEach(function(item) {
      setTimeout(function() {
        application.import("/lib/apis/" + item + ".js");
      }, timeout);
      timeout = timeout + 200;
    });
    // interface
    application.import("/lib/gui.css");
    application.import("/lib/app.css");
    setTimeout(function() {
      // app files
      application.import("/apps/" + appTitle + ".ap/index.css");
      application.import("/apps/" + appTitle + ".ap/index.js");
      // system font
      application.font("Signika");
      $("body").attr("style", "");
      $("form").on("submit", function(event) {
        event.preventDefault();
      });
      if (main) main.start(app.id);
      start();
    }, 1500);
  }
}