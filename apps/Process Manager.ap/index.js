let keeptrack;
let selected_process;
let last_processes;

let performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
let memorycheck;
let memory = {};

$(function () {
	keeptrack = setInterval(function () {
		// if (!last_processes || main.processes !== last_processes) {
		// last_processes = main.processes;
		// app.log("Updated process list");
		let i = 1;
		let list = "<table><thead><th></th><th>#</th><th>process</th><th>id</th><th>type</th><th></th></thead><tbody>";
		main.processes.forEach(function (process) {
			index = i.toString();
			let type = "System";
			if (process.app === true) type = "App";
			else if (process.applet === true) type = "Applet";
			if (index.length === 1) index = "0" + i;
			let name = process.name;
			let notres = "";
			if (main.unresponsive.includes(process)) {
				name += " (unresponsive)";
				let notres = "style='background:#ff000030;'";
			}
			list += "<tr data-id='" + process.id + "' data-name='" + process.name + "' " + notres + ">";
			// list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
			if (process.app === true) list += "<td><img src='/apps/" + process.name + ".ap/icon/32.png' width='24'/></td>";
			else list += "<td><img src='/res/icons/app.svg' width='24'/></td>";
			list += "<td>" + index + "</td>";
			if (process.app === true) list += "<td onclick='main.apps.showWindow(&quot;" + process.id + "&quot;);'>" + name + "</td>";
			else list += "<td>" + name + "</td>";
			list += "<td>" + process.id + "</td>";
			list += "<td>" + type + "</td>";
			if (!main.cantkill.includes(process.name)) list += "<td><button class='small' onclick='kill(&quot;" + process.id + "&quot;,&quot;" + process.name + "&quot;);'>Kill</button></td>";
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
	// let processMenu = new Menu("Process");
	// processMenu.add("Kill process", function() {
	//   if (selected_process) {
	//     let name = $(selected_process).attr("data-name");
	//     if (!cantkill.includes(name)) kill($(selected_process).attr("data-id"), name);
	//     else Window.dialog.message(false, "Process '" + name + "' is a system process and cannot be killed.");
	//   } else Window.dialog.message(false, "No process selected");
	// });
	// show memory stats
	if (performance.memory) {
		getMemory = setInterval(function () {
			systemMemory = main.systemMemory;
			memory.total = main.files.formatBytes(systemMemory.totalJSHeapSize);
			memory.used = main.files.formatBytes(systemMemory.usedJSHeapSize);
			memory.limit = main.files.formatBytes(systemMemory.jsHeapSizeLimit);
			memory.percent = parseInt(memory.total.split(" ")[0]) - (parseInt(memory.total.split(" ")[0]) - parseInt(memory.used.split(" ")[0]));
			let report = "<div><h3>" + memory.limit + "</h3><p>Heap Size Limit</p></div>";
			report += "<div><h3>" + memory.total + "</h3><p>Total Heap Size</p></div>";
			report += "<div><h3>" + memory.used + "</h3><p>Used Heap Size</p></div>";
			$(".stats").html(report);
			$("progress#alloc").attr("max", main.systemMemory.totalJSHeapSize).val(main.systemMemory.usedJSHeapSize);
			$("progress#limit").attr("max", main.systemMemory.jsHeapSizeLimit).val(main.systemMemory.totalJSHeapSize);
		}, 1000);
	} else {
		$(".memorymonitor").remove();
	}
	Window.show();
});

function kill(id, name) {
	Window.dialog.ask("Kill process '" + name + "'", "Are you sure?", function () {
		main.get_process(id, function (process) {
			process.kill();
		});
	});
}

function close() {
	if (getMemory) clearInterval(getMemory);
	clearInterval(keeptrack);
	Window.close();
}