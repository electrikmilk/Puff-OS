console.time("window.load");
var frameworks = ["jquery", "jquery-ui", "bootstrap", "mousetrap"];
var apis = ["cursor"];
var timeout = 1000;
var main = null;
if (parent.desktop) main = parent;

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

function loadFont(name) {
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
      font.log("loaded font '" + name + "'");
    } else if (xhr.status !== 200) font.log("font '" + name + "' does not exist", "error", xhr);
  };
  xhr.send();
}

var app; // define app instance

var application = {
  title: function(title) {
    title = appTitle + " &mdash; " + title;
    document.title = title;
    $("title").html(title);
    app.log("title: " + title);
  }
};

window.onload = function() {
  console.timeEnd("window.load");
  if (!main) console.warn("running in solo mode");
  if (!appTitle || !appVersion) {
    if (main) main.desktop.log("App error: no name or version!", "error");
  } else {
    console.info("Running app '" + appTitle + "' (" + appVersion + ")...");
    // frameworks (external)
    frameworks.forEach(function(item) {
      setTimeout(function() {
        importfile("/lib/frameworks/" + item + ".min.js");
      }, timeout);
      timeout = timeout + 200;
    });
    // apis (internal)
    apis.forEach(function(item) {
      setTimeout(function() {
        importfile("/lib/apis/" + item + ".js");
      }, timeout);
      timeout = timeout + 200;
    });
    // interface
    importfile("/lib/gui.css");
    importfile("/lib/app.css");
    setTimeout(function() {
      // app files
      importfile("/apps/" + appTitle + ".ap/index.css");
      importfile("/apps/" + appTitle + ".ap/index.js");
      // system font
      loadFont("Poppins");
      if (main) {
        main.processes.forEach(function(item) {
          if (item.name === appTitle) {
            app = main.processes[main.processes.indexOf(item)];
          }
        });
      }
      $("body").attr("style", "");
      $("form").on("submit", function(event) {
        event.preventDefault();
      });
      if (main) main.start(app.id);
      start();
    }, 1500);
  }
}