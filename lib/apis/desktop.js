var open_apps = [];

var apps = {
  open: function(name, newinstance = false, params) {
    if ($(".window[data-title='" + name + "']").length !== 0 && newinstance === false) {
      apps.show(name);
    } else {
      var newapp = new Process(name, true);
      open_apps.push(newapp);
      if ($(".app-item[tooltip='" + name + "']").length === 0) {
        network.request(
          "lib/server", "POST", {
            action: "apps",
            query: name
          },
          function(response) {
            desktop.log("Added missing app '" + name + "' to toolbar");
            $(".toolbar-container").append(response);
            system.tooltips();
          },
          function(error) {
            desktop.log("Failed to add app '" + name + "' to toolbar", "error", error);
          }
        );
      }
      $(".app-item[tooltip='" + name + "']").addClass("opening").html("<div class='loader'></div>");
      network.request(
        "lib/server", "POST", {
          action: "window_template",
          id: newapp.id,
          name: newapp.name,
          data: params
        },
        function(response) {
          $(".window").removeClass("ui-selected");
          $(".windows-container").append(response);
          $(".windows-container").selectable();
          $(".window").draggable({
            handle: ".window-bar",
            containment: "parent"
          });
          $(".window").resizable({
            containment: ".windows-container",
            minHeight: 200,
            minWidth: 500,
            handles: 'nw,ne,sw,se,n,e,s,w',
          });
          $(".window-bar").on("click", function() {
            $(".window").removeClass("ui-selected");
            $(".ui-selectee").removeClass("ui-selectee");
            $(this).parent().addClass("ui-selected");
            $(".app-menu").hide();
            var id = $(this).parent().attr("id");
            $(".app-menu#menu-" + id).show();
          });
          $(".window-content iframe").on("mousedown, mouseup, click", function() {
            $(this).parent().parent().parent().addClass("ui-selected");
          });
          $(".window-close").on("click", function() {
            var id = $(this).parent().parent().parent().attr("id");
            apps.close(id);
          });
          $(".window-min").on("click", function() {
            $(this).parent().parent().parent().addClass("minimized");
          });
        },
        function(error) {
          desktop.log("Failed to create window for '" + name + "'", "error", error);
        }
      );
      network.request(
        "lib/server", "POST", {
          action: "menu_template",
          id: newapp.id,
          name: newapp.name
        },
        function(response) {
          $(".app-menu").hide();
          $(".app-menus").append(response);
        },
        function(error) {
          desktop.log("Failed to create menu for '" + name + "'", "error", error);
        }
      );
    }
  },
  start: function(id) {
    $(".window#" + id).show();
    get_process(id, function(process) {
      $(".app-item[tooltip='" + process.name + "']").removeClass("opening").addClass("open").html("");
    });
  },
  show: function(name) {
    $(".window").removeClass("ui-selected");
    $(".app-menu").hide();
    $(".window[data-title='" + name + "']").removeClass("minimized").addClass("ui-selected");
    $(".app-menu[data-title='" + name + "']").show();
  },
  showWindow: function(id) {
    $(".window").removeClass("ui-selected");
    $(".app-menu").hide();
    $(".window#" + id).removeClass("minimized").addClass("ui-selected");
    $("#menu-" + id).show();
  },
  refresh: function(id) {
    document.querySelector(".window#" + id + " .window-content iframe").contentWindow.window.location.reload(true);
    get_process(id, function(process) {
      apps.close(id);
      setTimeout(function() {
        apps.open(process.name, true);
      }, 500);
    });
  },
  close: function(id) {
    // politely ask the app to wrap up and close
    console.log(".window#" + id + " .window-content iframe");
    document.querySelector(".window#" + id + " .window-content iframe").contentWindow.close();
  },
  list: function() {
    network.request("lib/server", "POST", {
        action: "apps"
      },
      function(response) {
        $(".toolbar-container").html(response);
        system.tooltips();
      },
      function(error) {
        desktop.log("unable to load toolbar apps", "error");
      }
    );
  },
  about: function(name) {
    apps.open("About", true, {
      name: name
    });
  },
  audio: function(process) {
    return new Audio(process);
  },
  dialog: function(title, message, callback, ok, cancel) {
    apps.open("Dialog", true, {
      title: title,
      message: message,
      callback: callback,
      ok: ok,
      cancel: cancel
    });
  }
}

var options = {
  about: {
    label: "About " + osname,
    onClick: "apps.open(&quot;About&quot;,true)",
    divider: true
  },
  refresh: {
    label: "Reload " + osname,
    onClick: "system.refresh()"
  },
  logout: {
    label: "Logout",
    onClick: "system.logout()"
  },
  exit: {
    label: "Exit",
    onClick: "system.exit()"
  }
};

$(function() {
  // load in system menu
  for (var key in options) {
    $(".system-menu .menubar-menu ul").append("<li onclick='" + options[key].onClick + "'>" + options[key].label + "</li>");
    if (options[key].divider === true) {
      $(".system-menu .menubar-menu ul").append("<hr/>");
    }
  }
  // if set wallpaper, load it
  var setWallpaper = system.storage.get("wallpaper");
  if (setWallpaper) {
    system.wallpaper.image(setWallpaper);
  }
  apps.list(); // load in list of apps to toolbar
  network.request("lib/server", "POST", {
      action: "all_apps"
    },
    function(response) {
      $(".system-menu .menubar-menu ul").append(response);
    },
    function(error) {
      desktop.log("unable to load list of apps", "error");
    }
  );
  // start checking window title changes
  setInterval(function() {
    if ($(".window:not(.minimized)").length !== 0) {
      $(".window:not(.minimized)").each(function(index, item) {
        var title = $(this).find("iframe").contents().find('title').html();
        $(this).find(".window-title > div > div:last-child").html(title);
      });
    }
  }, 1000);
  // open a Terminal (maybe a welcome app in the future instead)
  setTimeout(function() {
    apps.open("Terminal");
  }, 1000);
});