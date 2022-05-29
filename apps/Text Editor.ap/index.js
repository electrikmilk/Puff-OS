let path = false;

$(function () {
	if (get['path']) {
		path = get['path'];
	}
	if (!path) {
		let formatMenu = new Menu('Format');
		formatMenu.add('Bold', 'command+b', function () {
			format('bold');
		});
		formatMenu.add('Italic', function () {
			format('italic');
		});
		formatMenu.add('Underline', function () {
			format('underline');
		});
		formatMenu.add('Strike-through', function () {
			format('strikeThrough');
		});
	}
	fileMenu.divider();
	fileMenu.add('Open...', function () {
		main.apps.open('Files', true, {
			action: 'pick',
			app: app.name
		});
	});
	fileMenu.add('Save', function () {
		save();
	});
	Window.show();
	$('.contents').focus();
});

function save() {
	let content = '';
	if ($('textarea.contents').length === 0) {
		content = $('textarea.contents').val();
	} else {
		content = $('.contents').html();
	}
	main.apps.open('Files', true, {
		action: 'save',
		from: app.name,
		content: content,
		path: path
	});
}

function format(type) {
	if (type === 'CreateLink') {
		Window.dialog.input(false, 'Enter URL:', function (url) {
			if (response) {
				$('.contents').focus();
				document.execCommand('CreateLink', false, url);
			}
		});
		return;
	}
	document.execCommand(type);
}

function close() {
	Window.close();
}