var open_apps = [];

list_processes();

function start(id) {
  $(".window#" + id).show();
  get_process(id, function(item) {
    $(".app-item[title='" + item.name + "']").removeClass("opening").addClass("open");
  });
}

var apps = {
  open: function(name) {
    if ($(".window[data-title='" + name + "']").length !== 0) {
      apps.show(name);
    } else {
      var newapp = new Process(name, true);
      open_apps.push(newapp);
      $(".app-item[title='" + name + "']").addClass("opening");
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
    get_process(id, function(process) {
      process.kill();
    });
    $(".window#" + id).remove();
    setTimeout(function() {
      if ($(".window[data-title='" + name + "']").length === 0) {
        $(".app-item[title='" + name + "']").removeClass("open");
      }
    }, 500);
  },
  list: function() {
    network.request("lib/server", "POST", {
        action: "apps"
      },
      function(response) {
        $(".toolbar-container").html(response);
      },
      function(error) {
        desktop.log("unable to load list of apps", "error");
      }
    );
  }
}

apps.list();
apps.open("Terminal");