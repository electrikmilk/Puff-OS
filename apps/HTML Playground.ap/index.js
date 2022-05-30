$(function () {
	update();
	$('textarea').on('keyup', function () {
		update();
	});
	Window.show();
	$('textarea').focus();
});

function update() {
	$('iframe').attr('src', 'data:text/html,' + $('textarea').val());
}

function close() {
	Window.close();
}