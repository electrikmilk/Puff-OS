var cantkill = ["system", "desktop", "videoAPI", "audioAPI"];
var keeptrack;

$(function() {
  keeptrack = setInterval(function() {
    var i = 1;
    var list = "<table><thead><th></th><th>#</th><th>process</th><th>id</th><th>type</th><th></th></thead><tbody>";
    main.processes.forEach(function(process) {
      index = i.toString();
      if (process.app === true) var type = "app";
      else var type = "system";
      if (index.length === 1) index = "0" + i;
      list += "<tr>";
      list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
      // if (process.app === true) {
      //   if (exists) list += "<td><img src='/apps/" + process.name + ".ap/icon/32.png' width='24'/></td>";
      //   else list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
      // } else list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
      list += "<td>" + index + "</td>";
      list += "<td>" + process.name + "</td>";
      list += "<td>" + process.id + "</td>";
      list += "<td>" + type + "</td>";
      if (!cantkill.includes(process.name)) list += "<td><button onclick='kill(&quot;" + process.id + "&quot;,&quot;" + process.name + "&quot;);'>Kill</button></td>";
      else list += "<td></td>";
      list += "</tr>";
      ++i;
    });
    list += "</tbody></table>";
    if ($(".output").html() !== list) {
      $(".output").html(list);
      $(".output tbody").selectable();
    }
  }, 500);
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