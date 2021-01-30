var open_apps = [];

list_processes();

function start(id) {
  $(".window#" + id).show();
  get_process(id, function(item) {
    $(".app-item[tooltip='" + item.name + "']").removeClass("opening").addClass("open").html("");
  });
}

var apps = {
  open: function(name) {
    if ($(".window[data-title='" + name + "']").length !== 0) {
      apps.show(name);
    } else {
      var newapp = new Process(name, true);
      open_apps.push(newapp);
      $(".app-item[tooltip='" + name + "']").addClass("opening").html("<div class='loader'></div>");
      network.request(
        "lib/server", "POST", {
          action: "window_template",
          id: newapp.id,
          name: newapp.name
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
    }
  },
  show: function(name) {
    $(".window[data-title='" + name + "']").removeClass("minimized");
  },
  close: function(id) {
    $(".window#" + id).remove();
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
  }
}

var options = {
  about: {
    label: "About",
    onClick: "apps.open(&quot;About&quot;)",
    divider: true
  },
  monitor: {
    label: "New Process Manager",
    onClick: "apps.open(&quot;Process Manager&quot;)"
  },
  terminal: {
    label: "New Terminal",
    onClick: "apps.open(&quot;Terminal&quot;)"
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
    label: "Reload " + osname + "...",
    onClick: "system.refresh()"
  }
};

var setWallpaper = system.storage.get("wallpaper");
if (setWallpaper) {
  system.wallpaper.set(setWallpaper);
}

apps.list();
apps.open("Terminal");
for (var key in options) {
  $(".system-menu .menubar-menu ul").append("<li onclick='" + options[key].onClick + "'>" + options[key].label + "</li>");
  if (options[key].divider === true) {
    $(".system-menu .menubar-menu ul").append("<hr/>");
  }
}