<script>
if(navigator.connection) {
  var info = "Connection effective type: "+main.network.type()+"<br/>";
  info += "Downlink: "+main.network.connection().downlink+"<br/>";
  if(main.network.online())info += "You are currently online :)<br/>";
  else info += "You are currently offline :(<br/>";
} else var info = "Network detection not supported.";
$(".backlog ul").append("<li class='response'>" + info + "</li>");
</script>
