$(function () {
	editMenu.divider();
	editMenu.add("Find...", function () {
		Window.dialog.input("Find in Playground:", false, function () {

		});
	});
	update();
	$("textarea").on("keyup", function () {
		update();
	});
	Window.show();
	Window.title("New Playground");
	$("textarea").focus();
});

function update() {
	$("iframe").attr("src", "data:text/html," + $("textarea").val());
}

function close() {
	Window.close();
}