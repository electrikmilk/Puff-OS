$(function() {
  setInterval(function() {
    var i = 1;
    var list = "<table><thead><th></th><th>#</th><th>command</th><th>pid</th></thead>";
    parent.processes.forEach(function(item) {
      index = i.toString();
      if (index.length === 1) index = "0" + i;
      list += "<tr><td><img src='' width='16'/></td>"; // <img src='/apps/" + item.name + ".ap/icon/16.png' width='16'/>
      list += "<td>" + index + "</td>";
      list += "<td>" + item.name + "</td>";
      list += "<td>" + item.id + "</td></tr>";
      ++i;
    });
    list += "</thead></table>";
    $(".output").html(list);
  }, 500);
});

function start() {

}

function end() {

}