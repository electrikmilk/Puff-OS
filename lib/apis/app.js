console.time("window.load");
var frameworks = ["jquery", "jquery-ui", "bootstrap", "mousetrap"];
var apis = ["cursor"];
var timeout = 1000;
var main = null;
if (parent.desktop) main = parent;

var Window = {
  show: function() {
    main.apps.start(app.id);
  },
  close: function() {
    app.kill();
  },
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
        Window.import("/lib/frameworks/" + item + ".min.js");
      }, timeout);
      timeout = timeout + 200;
    });
    // apis (internal)
    apis.forEach(function(item) {
      setTimeout(function() {
        Window.import("/lib/apis/" + item + ".js");
      }, timeout);
      timeout = timeout + 200;
    });
    // interface
    Window.import("/lib/gui.css");
    Window.import("/lib/app.css");
    setTimeout(function() {
      // app files
      Window.import("/apps/" + appTitle + ".ap/index.css");
      Window.import("/apps/" + appTitle + ".ap/index.js");
      // system font
      Window.font("Signika");
      $("body").attr("style", "");
      $("form").on("submit", function(event) {
        event.preventDefault();
      });
      $(window).on("mousedown, mouseup, click", function() {
        main.apps.showWindow(app.id);
      });
    }, 1300);
  }
};

var Menu = {
  item: function(item, callback) {
    main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu ul li[data-item='" + item + "']").on("click", callback);
  },
  add: function(label, menu = false, id, item) {
    var menu = main.$(".app-menu#menu-" + app.id);
    if (menu === false) menu.append("<div class='menubar-menu-container'><div class='menubar-label'>" + label + "</div><div class='menubar-menu' data-label='" + label + "'><ul></ul></div></div>'");
    else {
      var menu = main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu[data-label='" + label + "'] ul");
      menu.append("<li data-item='" + id + "'>" + item + "</li>");
    }
  },
  clear: function(label) {
    main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu[data-label='" + label + "'] ul").html("");
  }
};