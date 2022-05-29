cwd = '/';

$(function () {
	let viewMenu = new Menu('View');
	viewMenu.add('As List', function () {

	});
	viewMenu.add('As Icons', function () {

	});
	fileMenu.divider();
	fileMenu.add('New Folder', function () {

	});
	fileMenu.add('New File', function () {

	});
	$('form').on('submit', function (e) {
		e.preventDefault();
		cwd = $('input#path').val();
		app.log(cwd);
		load();
	});
	load();
	Window.show();
	if (get['action'] === 'save') {
		Window.dialog.status('Saving...', get['path']);
		main.network.newRequest({
			url: 'action',
			data: {
				action: 'save',
				path: get['path'],
				content: get['content']
			},
			dataType: 'json',
			success: function (response) {
				if (response === 'saved') {
					Window.dialog.status('Saved!');
					setTimeout(function () {
						// Refocus app that requested save
						main.apps.open(get['from']);
						Window.close();
					}, 1000);
				} else {

				}
			},
			error: function () {

			}
		});
	}
});

function file(path, mime, ext) {
	let type = mime.split('/')[0];
	if (!path) return;
	let app = 'View';
	switch (type) {
		case 'image':
			app = 'View';
			break;
		case 'video':
			app = 'View';
			break;
		case 'text':
			app = 'Text Editor';
			break;
	}
	main.apps.open(app, true, {
		path: path
	});
}

function load(new_path) {
	if (new_path) {
		cwd = new_path;
	}
	app.log('load()', cwd);
	$('input').val(cwd);
	main.network.newRequest({
		url: '/apps/Files.ap/action',
		data: {
			action: 'load',
			cwd: cwd
		},
		success: function (response) {
			app.log('load()', response);
			if (get['action'] === 'pick') {
				Window.title('Open File');
			} else {
				Window.title(cwd);
			}
			$('.files').html(response);
		},
		error: function (error) {
			app.error('Unable to load files at path ' + cwd, error);
			Window.dialog.message('Error', 'Unable to load files at path ' + cwd + '!');
		}
	});
}

function back() {
	if (cwd !== '/') {
		let cwds = cwd.split('/');
		cwd = cwd.replace(cwds[cwds.length - 2] + '/', '');
		load();
	}
}

function close() {
	Window.close();
}