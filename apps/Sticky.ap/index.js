let colors = ['red', 'yellow', 'green', 'blue'];

$(function () {
	$('body').attr('class', main.random(colors));
	App.onReady(function () {
		fileMenu.clear();
		fileMenu.add('New Sticky', function () {
			main.apps.open('Sticky', true);
		});
		let colorMenu = new Menu('Color', 2);
		colors.forEach(function (color) {
			colorMenu.add(main.capitalize(color), function () {
				$('body').attr('class', color);
			});
		});
		Window.show();
		$('.note').focus();
	});
});

function close() {
	if ($('.note').val()) {
		Window.dialog.ask('Are you sure?', 'This sticky will be lost.', function () {
			Window.close();
		});
		return;
	}
	Window.close();
}