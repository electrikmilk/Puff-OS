let lastResult = main.system.cache.get("lastResult");

$(function () {
	if (lastResult) $(".result").html(lastResult);
	let outputMenu = new Menu("Output");
	outputMenu.add("Save current result", function () {
		main.system.cache.set("lastResult", parseInt($(".result").html()));
	});
	outputMenu.add("Clear current saved result", function () {
		main.system.cache.set("lastResult", "0");
	});
	Window.show();
});

function func(f) {
	if (f === "ac") {
		$(".result").html("0");
		main.system.cache.set("lastResult", "0");
	} else if (f === "c") {
		if ($(".result").html().length > 1) {
			$(".result").html($(".result").html().slice(0, -1));
		} else $(".result").html("0");
	} else if (f === "posneg") {
		if (current.includes("-")) {
			$(".result").html(current.replace("-", ""));
		} else {
			$(".result").html("-" + current);
		}
	}
}

function equals() {
	let result = eval($(".result").html());
	$(".result").html(result);
	main.system.cache.set("lastResult", result);
	app.log(result);
}

function input(val) {
	if ($(".result").text() === "0") $(".result").html("");
	$(".result").append(val);
}

function close() {
	Window.close();
}