let audio;
let path = false;
let filename;
type = '';

$(function () {
	Window.show();
	App.onReady(function () {
		if (Window.get('path')) {
			path = Window.get('path');
			filename = main.end(path.split('/'));
			if (type === 'audio') {
				audio = main.apps.audio(app);
				loadAudio(path);
			}
			Window.title(filename);
		}
	});
});

function loadAudio(url) {
	audio.set([url]);
	$('.play').on('click', function () {
		audio.element.play();
	});
	$('.pause').on('click', function () {
		audio.element.pause();
	});
	$('.stop').on('click', function () {
		audio.element.stop();
	});
	$('.volume').on('change', function () {
		audio.element.volume = $(this).val();
	});
	setInterval(function () {
		$('.volume').val(audio.element.volume);
	}, 1500);
}

function close() {
	Window.close();
}