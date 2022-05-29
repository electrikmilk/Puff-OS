let path = false;
let content = null;
let file = null;

$(function () {
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
	App.onReady(function () {
		load();
	});
	Window.show();
	$('.contents').focus();
});

function load(new_path) {
	if (Window.get('path')) {
		path = Window.get('path');
	}
	if (new_path) {
		path = new_path;
	}
	if (path) {
		$('#formatting').hide();
		$('#file').show();
		let filename = main.end(path.split('/'));
		Window.dialog.status('Loading...', path);
		Window.title('Loading...');
		file = main.AppFile(path);
		file.read(function (file_content) {
			content = file_content;
			$('textarea.contents').val(content);
			Window.dialog.hide();
			app.log(`Opened file ${filename}...`);
			Window.title(filename);
			$('textarea.contents').focus();
		});
	} else {
		$('#formatting').show();
		$('#file').hide();
	}
}

function save() {
	if ($('textarea.contents').length === 0) {
		content = $('textarea.contents').val();
	} else {
		content = $('.contents').html();
	}
	file.write(content, function (result) {
		if (result !== true) {
			Window.dialog.message('Failed to write to file!', path);
		}
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