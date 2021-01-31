var cantkill = ["system", "desktop"];

$(function() {
  setInterval(function() {
    var i = 1;
    var list = "<table><thead><th></th><th>#</th><th>command</th><th>pid</th><th>type</th><th></th></thead><tbody>";
    main.processes.forEach(function(item) {
      index = i.toString();
      if (item.app === true) var type = "app";
      else var type = "system";
      if (index.length === 1) index = "0" + i;
      list += "<tr>";
      if (item.app === true) list += "<td><img src='/apps/" + item.name + ".ap/icon/32.png' width='24'/></td>";
      else list += "<td></td>";
      list += "<td>" + index + "</td>";
      list += "<td>" + item.name + "</td>";
      list += "<td>" + item.id + "</td>";
      list += "<td>" + type + "</td>";
      if (!cantkill.includes(item.name)) list += "<td><a href='javascript:;' onclick='main.apps.close(&quot;" + item.id + "&quot;);'>Kill</a></td>";
      else list += "<td></td>";
      list += "</tr>";
      ++i;
    });
    list += "</tbody></table>";
    if ($(".output").html() !== list) $(".output").html(list);
  }, 300);
});

function start() {

}

function end() {

}