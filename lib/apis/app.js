console.time("window.load");
var frameworks = ["jquery"];
var apis = ["cursor"];
var timeout = 1000;
var main = null;
if (parent.system) main = parent;

var Window = {
  show: function() {
    main.apps.start(app.id);
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
  },
  menu: function(item, callback) {
    main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu ul li[data-item='" + item + "']").on("click", function() {
      app.log("menu '" + item + "'");
      callback();
    });
  }
}

class Menu {
  constructor(label, index) {
    this.label = label;
    this.index = ++index;
    if ($(".menubar-menu[data-label='" + this.label + "']").length === 0) {
      var menu = main.$(".app-menu#menu-" + app.id);
      if (this.index) {
        var selector = ":nth-child(" + (this.index) + ")";
        if (this.index === 1) selector = ":first-child";
        menu = main.$(".app-menu#menu-" + app.id + " > div.menubar-menu-container" + selector);
      }
      var newmenu = "<div class='menubar-menu-container'><div class='menubar-label'>" + this.label + "</div><div class='menubar-menu' data-label='" + this.label + "'><ul></ul></div></div>";
      console.log(menu);
      console.log(this.index);
      if (this.index) {
        app.log("adding menu '" + label + "' after " + this.index);
        menu.after(newmenu);
      } else {
        app.log("appending menu '" + label + "'");
        menu.append(newmenu);
      }
    }
  }
  add(id, item, callback) {
    var that = this;
    setTimeout(function() {
      var menu = main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu[data-label='" + that.label + "'] ul");
      menu.append("<li data-item='" + id + "'>" + item + "</li>");
      Window.menu(id, callback);
    }, 500);
  }
  remove() {
    main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu[data-label='" + this.label + "']").remove();
  }
  divider() {
    var that = this;
    setTimeout(function() {
      var menu = main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu[data-label='" + that.label + "'] ul");
      menu.append("<hr/>");
    }, 500);
  }
  clear() {
    main.$(".app-menu#menu-" + app.id + " .menubar-menu-container .menubar-menu[data-label='" + this.label + "'] ul").html("");
  }
}

var app; // define app instance

window.onload = function() {
  console.timeEnd("window.load");
  if (!main) console.warn("running in solo mode");
  if (!appTitle || !appVersion) {
    if (main) main.system.log("App error: no name or version!", "error");
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
      timeout = timeout + 300;
    });
    // apis (internal)
    apis.forEach(function(item) {
      setTimeout(function() {
        Window.import("/lib/apis/" + item + ".js");
      }, timeout);
      timeout = timeout + 300;
    });
    // interface
    Window.import("/lib/app.css");
    Window.import("/lib/gui.css");
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
      if (main.desktop !== null) {
        var fileMenu = new Menu("File", 0);
        fileMenu.add("newWindow", "New window", function() {
          main.apps.open(app.name, true);
        });
        var editMenu = new Menu("Edit", 1);
        editMenu.add("undo", "Undo", function() {
          document.execCommand("undo");
        });
        editMenu.add("redo", "Redo", function() {
          document.execCommand("undo");
        });
        editMenu.divider();
        editMenu.add("cut", "Cut", function() {
          document.execCommand("cut");
        });
        editMenu.add("copy", "Copy", function() {
          document.execCommand("copy");
        });
        editMenu.add("paste", "Paste", function() {
          document.execCommand("paste");
        });
        editMenu.divider();
        editMenu.add("selectAll", "Select All", function() {
          document.execCommand("selectAll");
        });
        setTimeout(function() {
          var windowMenu = new Menu("Window");
          windowMenu.add("min", "Minimize", function() {
            Window.minimize();
          });
          windowMenu.add("show", "Show window", function() {
            main.apps.showWindow(app.id);
          });
          windowMenu.add("showAll", "Show all windows", function() {
            main.apps.show(app.name);
          });
          var helpMenu = new Menu("Help");
          helpMenu.add("report", "Report a bug", function() {
            main.apps.open("Report Bug", true, {
              name: app.name
            });
          });
        }, 800);
      }
    }, 2000);
  }
};