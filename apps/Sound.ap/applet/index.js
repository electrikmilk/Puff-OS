let cantkill = ["system"];
$(function () {
	setInterval(function () {
		let i = 1;
		let list = "<table><tbody>";
		main.$(".system-audio audio").each(function (index, item) {
			main.processes.forEach(function (process) {
				index = i.toString();
				if (process.id === $(item).attr("process")) {
					let type = "system";
					if (process.app === true) type = "app";
					let vol = item.volume;
					list += "<tr>";
					if (process.app === true) list += "<td><img src='/apps/" + process.name + ".ap/icon/32.png' width='24'/></td>";
					else list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
					let name = process.name;
					if (process.name === "system") name = "System";
					list += "<td>" + name + "</td>";
					list += "<td><input type='range' min='0' max='1' step='0.1' value='" + vol + "' onchange='changeVol(&quot;" + process.id + "&quot;,this.value);'</td>";
					if (!cantkill.includes(process.name)) list += "<td><button onclick='kill(&quot;" + process.id + "&quot;,&quot;" + process.name + "&quot;);'>Stop</button></td>";
					else list += "<td></td>";
					list += "</tr>";
					++i;
				}
			});
		});
		list += "</tbody></table>";
		if ($(".output").html() !== list) $(".output").html(list);
	}, 1500);
});

function kill(id, name) {
	// Window.dialog.ask("Kill audio for '" + name + "'", 'Are you sure?', function() {
	//   main.kill_audio(id);
	// });
	main.kill_audio(id);
}

function changeVol(id, val) {
	main.get_audio(id, function (item) {
		item.volume = val;
	});
}