$(function () {
	Window.show();
	main.network.newRequest({
		type: 'GET',
		url: app.path + 'pages.php',
		success: function (response) {
			$('.pages').html(response);
			$('.pages > div').on('click', function () {
				let page = $(this).data('page');
				main.network.newRequest({
					url: app.path + 'pages/page.php',
					data: {
						page: page
					},
					success: function (response) {
						$('.pages').slideUp();
						$('.page-content').html(response);
						$('.page').slideDown();
					},
					error: function (error) {
						app.log('error loading page', 'error', error);
						Window.dialog.message('Whoops!', 'Error loading settings pane. Please try again.');
					}
				});
			});
		},
		error: function (error) {
			app.log('error loading pages', 'error', error);
			Window.dialog.message('Whoops!', 'Error loading settings panes', function () {
				Window.close();
			});
		}
	});
	$('.back-btn').on('click', function () {
		$('.pages').slideDown();
		$('.page').slideUp();
	});
});

function set_wallpaper(url) {
	Window.dialog.ask(false, 'Set as your new wallpaper?', function () {
		main.system.wallpaper.image(url, false);
	});
}

function close() {
	Window.close();
}