var open_apps = [];

list_processes();

// class App {
//   constructor(name) {
//     this.id = system.guid();
//     this.name = name;
//     apps.push(this);
//     new Process(this.name);
//     list_applications();
//   }
//   kill() {
//     let i = apps.indexOf(this);
//     apps.splice(i, 1);
//     delete this;
//     processes.forEach(function(item) {
//       if (item.name === this.name) {
//         item.kill();
//       }
//     })
//   }
// }

function start(id) {
  $(".window#" + id).show();
}

var apps = {
  open: function(name) {
    var newapp = new Process(name, true);
    open_apps.push(newapp);
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
        // apps.list();
      },
      function(error) {

      }
    );
  },
  close: function(id) {
    get_process(id, function(process) {
      process.kill();
    });
    $(".window#" + id).remove();
    apps.list();
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
    // var list;
    // processes.forEach(function(item) {
    //   if (item.app === true) {
    //     list = "<div class='app-item' id='" + item.id + "' onclick='desktop.open(&quot;" + item.name + "&quot;);'>" + item.name + "</div>";
    //   }
    // });
    // $(".toolbar-container").html(list);
  }
}

apps.list();