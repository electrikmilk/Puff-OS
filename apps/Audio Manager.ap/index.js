var cantkill = ["system"];

$(function() {
  setInterval(function() {
    var i = 1;
    var list = "<table><thead><th></th><th>#</th><th>process</th><th>level</th><th>id</th><th>type</th><th></th></thead><tbody>";
    main.$(".system-audio audio").each(function(index, item) {
      main.processes.forEach(function(process) {
        index = i.toString();
        if (process.id === $(item).attr("process")) {
          if (process.app === true) var type = "app";
          else var type = "system";
          var vol = item.volume;
          list += "<tr>";
          // if (process.app === true) list += "<td><img src='/apps/" + process.name + ".ap/icon/32.png' width='24'/></td>";
          // else list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
          list += "<td></td>";
          list += "<td>" + index + "</td>";
          list += "<td>" + process.name + "</td>";
          list += "<td><input type='range' min='0' max='1' step='0.1' value='" + vol + "' onchange='changeVol(&quot;" + process.id + "&quot;,this.value);'</td>";
          list += "<td>" + process.id + "</td>";
          list += "<td>" + type + "</td>";
          if (!cantkill.includes(process.name)) list += "<td><a href='javascript:;' onclick='main.kill_audio(&quot;" + process + "&quot;);'>Kill</a></td>";
          else list += "<td></td>";
          list += "</tr>";
          ++i;
        }
      });
    });
    list += "</tbody></table>";
    if ($(".output").html() !== list) $(".output").html(list);
  }, 1000);
});

function changeVol(id, val) {
  main.get_audio(id, function(item) {
    item.volume = val;
  });
}

function start() {

}

function end() {

}