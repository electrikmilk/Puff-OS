let info;

$(function () {
	setInterval(function () {
		if (navigator.connection) {
			info = "Connection effective type: " + main.network.type() + "<br/>";
			info += "Downlink: " + main.network.connection().downlink + "<br/>";
			if (main.network.online()) info += "You are currently online :)<br/>";
			else info += "You are currently offline :(<br/>";
		} else info = "Network detection not supported.";
		$(".output").html(info);
	}, 1500);
});