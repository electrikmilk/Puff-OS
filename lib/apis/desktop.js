var open_apps = [];

function start(id) {
  $(".window#" + id).show();
  get_process(id, function(process) {
    $(".app-item[tooltip='" + process.name + "']").removeClass("opening").addClass("open").html("");
  });
}

var apps = {
  open: function(name, newinstance = false, params) {
    if ($(".window[data-title='" + name + "']").length !== 0 && newinstance === false) {
      apps.show(name);
    } else {
      var newapp = new Process(name, true);
      open_apps.push(newapp);
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
          $(".window-content iframe").contents().on("mousedown, mouseup, click", function() {
            $(this).parent().parent().addClass("ui-selected");
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
  show: function(name) {
    $(".window").removeClass("ui-selected");
    $(".app-menu").hide();
    $(".window[data-title='" + name + "']").removeClass("minimized").addClass("ui-selected");
    $(".app-menu[data-title='" + name + "']").show();
  },
  close: function(id) {
    $(".window#" + id).remove();
    $(".app-menu#menu-" + id).remove();
    get_process(id, function(process) {
      if ($(".window[data-title='" + process.name + "']").length === 0) {
        $(".app-item[tooltip='" + process.name + "']").removeClass("open");
      }
      process.kill();
    });
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
        desktop.log("unable to load list of apps", "error");
      }
    );
  },
  about: function(name) {
    apps.open("About", true, {
      name: name
    });
  }
}

var options = {
  about: {
    label: "About " + osname,
    onClick: "apps.open(&quot;About&quot;,true)",
    divider: true
  },
  test: {
    label: "Enter UI test mode",
    onClick: "system.test()",
    divider: true
  },
  logout: {
    label: "Logout",
    onClick: "system.logout()"
  },
  refresh: {
    label: "Reload " + osname,
    onClick: "system.refresh()"
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
    system.wallpaper.set(setWallpaper);
  }
  apps.list(); // load in list of apps to toolbar
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