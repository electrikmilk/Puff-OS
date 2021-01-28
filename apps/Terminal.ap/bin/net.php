<script>
var info = "Connection effective type: "+main.network.type()+"<br/>";
info += "Downlink: "+main.network.connection().downlink+"<br/>";
if(main.network.online())info += "You are currently online :)<br/>";
else info += "You are currently offline :(<br/>";
$(".backlog ul").append("<li class='response'>" + info + "</li>");
</script>
