<script>
var list = "";
var i = 1;
main.processes.forEach(function(item) {
  index = i.toString();
  if (index.length === 1) index = "0" + i;
  list += "[" + index + "] " + item.name + " (" + item.id + ")<br/>";
  ++i;
});
$(".backlog ul").append("<li class='response'>" + list + "</li>");
</script>
