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
          $(".windows-container").append(response);
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
          $(".window-close").on("click", function() {
            var id = $(this).parent().parent().parent().attr("id");
            apps.close(id);
          });
          $(".window-min").on("click", function() {
            $(this).parent().parent().parent().fadeOut();
          });
        },
        function(error) {
          desktop.log("Failed to create window for '" + name + "'", "error", error);
        }
      );
    }
  },
  show: function(name) {
    $(".window[data-title='" + name + "']").fadeIn();
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

setTimeout(function() {
  apps.list();
  apps.open("Terminal");
}, 100);