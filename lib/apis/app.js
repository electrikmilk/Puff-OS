/* App API */
console.time("window.load");
var frameworks = ["jquery"];
var apis = ["cursor"];
var timeout = 1000;
var main = null;
if (parent.system) main = parent;

var fileMenu, editMenu, windowMenu, helpMenu;

var Import = {
  api: function(name) {
    let url = "/lib/apis/app/" + name + ".js";
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", url);
    head.appendChild(script);
    app.log("imported api " + name + "...");
  },
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

var Window = {
  show: function() {
    main.apps.start(app.id);
  },
  ready: function() {
    main.apps.ready(app.id);
  },
  close: function() {
    app.kill();
  },
  minimize: function() {
    main.$(".window#" + app.id + " .window-bar .window-min").click();
  },
  title: function(title) {
    title = appTitle + " &mdash; " + title;
    document.title = title;
    $("title").html(title);
    app.log("title: " + title);
  },
  dialog: {
    message: function(title, message, confirm) {
      $(".dialog-confirm,.dialog-cancel").unbind();
      $(".dialogs-container").css("display", "flex");
      $(".dialog").slideDown();
      $(".dialog-input").hide();
      $(".dialog h3").html(title);
      $(".dialog p").html(message);
      $(".dialog-cancel").hide();
      $(".dialog-confirm").on("click", function() {
        $(".dialog").slideUp();
        $(".dialogs-container").fadeOut();
        if (confirm) confirm();
      });
      $(".dialog-confirm").focus();
    },
    ask: function(title, message, confirm, cancel) {
      $(".dialog-confirm,.dialog-cancel").unbind();
      $(".dialogs-container").css("display", "flex");
      $(".dialog").slideDown();
      $(".dialog-input").hide();
      $(".dialog h3").html(title);
      $(".dialog p").html(message);
      $(".dialog-cancel").show();
      $(".dialog-confirm").on("click", function() {
        $(".dialog").slideUp();
        $(".dialogs-container").fadeOut();
        confirm();
      });
      $(".dialog-cancel").on("click", function() {
        $(".dialog").slideUp();
        $(".dialogs-container").fadeOut();
        if (cancel) cancel();
      });
      $(".dialog-confirm").focus();
    },
    input: function(title, message, confirm, cancel) {
      $(".dialog-confirm,.dialog-cancel").unbind();
      $(".dialogs-container").css("display", "flex");
      $(".dialog").slideDown();
      $(".dialog-input").show();
      $(".dialog h3").html(title);
      $(".dialog p").html(message);
      $(".dialog-cancel").show();
      $(".dialog-confirm").on("click", function() {
        $(".dialog").slideUp();
        $(".dialogs-container").fadeOut();
        confirm($(".dialog-input-textbox").val());
        $(".dialog-input-textbox").val("");
      });
      $(".dialog-cancel").on("click", function() {
        $(".dialog").slideUp();
        $(".dialogs-container").fadeOut();
        if (cancel) cancel();
      });
      $(".dialog-input-textbox").focus();
    }
  }
}

var app; // define app instance
var appTitle;

window.onload = function() {
  console.timeEnd("window.load");
  if (!main) console.warn("running in solo mode");
  if (!manifest.name || !manifest.version) {
    if (main) main.main.log("App error: no name or version!", "error");
  } else {
    appTitle = manifest.name;
    console.info("Running app '" + manifest.name + "' (" + manifest.version + ")...");
    if (main) {
      main.processes.forEach(function(item) {
        if (item.name === manifest.name) {
          app = main.processes[main.processes.indexOf(item)];
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
    // app apis
    if (manifest.import) {
      manifest.import.forEach(function(item) {
        setTimeout(function() {
          Import.api(item);
        }, timeout);
        timeout = timeout + 300;
      });
    }
    // interface
    Import.file("/lib/app.css");
    Import.file("/lib/gui.css");
    setTimeout(function() {
      // system font
      Import.font("Signika");
      $("body").attr("style", "");
      $("form").on("submit", function(event) {
        event.preventDefault();
      });
      $(window).on("mousedown, mouseup, click", function() {
        main.apps.showWindow(app.id);
      });
      // app files
      Import.file("/apps/" + manifest.name + ".ap/index.css");
      Import.file("/apps/" + manifest.name + ".ap/index.js");
    }, 2000);
    Window.ready();
  }
};