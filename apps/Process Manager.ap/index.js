var cantkill = ["system", "desktop", "videoAPI", "audioAPI", "memoryMonitor"];
var keeptrack;

var selected_process;
var last_processes;

$(function() {
  keeptrack = setInterval(function() {
    // if (!last_processes || main.processes !== last_processes) {
    // last_processes = main.processes;
    // app.log("Updated process list");
    var i = 1;
    var list = "<table><thead><th></th><th>#</th><th>process</th><th>id</th><th>type</th><th></th></thead><tbody>";
    main.processes.forEach(function(process) {
      index = i.toString();
      if (process.app === true) var type = "app";
      else var type = "system";
      if (index.length === 1) index = "0" + i;
      list += "<tr data-id='" + process.id + "' data-name='" + process.name + "'>";
      list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
      // if (process.app === true) {
      //   if (exists) list += "<td><img src='/apps/" + process.name + ".ap/icon/32.png' width='24'/></td>";
      //   else list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
      // } else list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
      list += "<td>" + index + "</td>";
      if (process.app === true) list += "<td onclick='main.apps.showWindow(&quot;" + process.id + "&quot;);'>" + process.name + "</td>";
      else list += "<td>" + process.name + "</td>";
      list += "<td>" + process.id + "</td>";
      list += "<td>" + type + "</td>";
      if (!cantkill.includes(process.name)) list += "<td><button class='small' onclick='kill(&quot;" + process.id + "&quot;,&quot;" + process.name + "&quot;);'>Kill</button></td>";
      else list += "<td></td>";
      list += "</tr>";
      ++i;
    });
    list += "</tbody></table>";
    $(".output").html(list);
    // $(".output tbody").selectable({
    //   stop: function() {
    //     if (this) {
    //       $(".ui-selected", this).each(function() {
    //         selected_process = this;
    //       });
    //     } else selected_process = null;
    //   }
    // });
    // }
  }, 1500);
  // var processMenu = new Menu("Process");
  // processMenu.add("kill", "Kill process", function() {
  //   if (selected_process) {
  //     var name = $(selected_process).attr("data-name");
  //     if (!cantkill.includes(name)) kill($(selected_process).attr("data-id"), name);
  //     else Window.dialog.message(false, "Process '" + name + "' is a system process and cannot be killed.");
  //   } else Window.dialog.message(false, "No process selected");
  // });
  Window.show();
});

function kill(id, name) {
  Window.dialog.ask("Kill process '" + name + "'", 'Are you sure?', function() {
    main.get_process(id, function(process) {
      process.kill();
    });
  });
}

function close() {
  clearInterval(keeptrack);
  Window.close();
}