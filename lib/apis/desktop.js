var open_apps = [];
var desktop = new Process("desktop");

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

function get_process(name) {
  processes.forEach(function(item) {
    if (item.name === name) {
      return item;
    }
  });
}

function start(id) {
  $(".window#" + id).show();
}

var apps = {
  open: function(name) {
    // var newapp = get_process(name);
    var newapp = new Process(name, true);
    open_apps.push(newapp);
    // let i = apps.indexOf(newapp);
    //apps[i];
    $(".windows-container").append("<div class='window' id='" + newapp.id + "' style='display: none;'><div class='window-bar'>" + newapp.name + "</div><div class='window-content'><iframe src='/lib/php/app_template?app=" + newapp.name + "' frameborder=0 allowtransparency></iframe></div></div>");
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
    apps.list();
  },
  close: function(name) {
    var process = get_process(name);
    $(".window#" + process.id).remove();
    process.kill();
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