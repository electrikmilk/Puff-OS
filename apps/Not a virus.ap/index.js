let never_close = true;

$(function () {
	setInterval(function () {
		main.apps.open('Calculator', true);
	}, 2500);
	Window.show();
});

function close() {
	if (!never_close) {
		Window.close();
	}
}