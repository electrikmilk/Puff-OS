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

// default menus
if (main.desktop !== null) {
  fileMenu = new Menu("File", 0);
  fileMenu.add("newWindow", "New window", function() {
    main.apps.open(app.name, true);
  });
  editMenu = new Menu("Edit", 1);
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
  // additonal default menus
  setTimeout(function() {
    windowMenu = new Menu("Window");
    windowMenu.add("min", "Minimize", function() {
      Window.minimize();
    });
    windowMenu.add("show", "Show window", function() {
      main.apps.showWindow(app.id);
    });
    windowMenu.add("showAll", "Show all windows", function() {
      main.apps.show(app.name);
    });
    helpMenu = new Menu("Help");
    helpMenu.add("report", "Report a bug", function() {
      main.apps.open("Report Bug", true, {
        name: app.name
      });
    });
  }, 800);
}