$(function () {
	setInterval(function () {
		let list = '';
		main.log.forEach(function (item) {
			list += '<li>' + item + '</li>';
		});
		if ($('.output ul').html() !== list) {
			$('.output ul').html(list);
		}
		$('html, body').scrollTop($(document).height());
	}, 1500);
	Window.show();
});

function close() {
	Window.close();
}