/* App API */
console.time('[app] DOM load');
let frameworks = ['jquery'];
let apis = ['cursor', 'files'];
let main = parent;
let fileMenu, editMenu, windowMenu, helpMenu;
let get = [];
let cache = '';

let app; // Define app instance
let appTitle;

document.addEventListener('DOMContentLoaded', async function () {
	console.timeEnd('[app] DOM load');
	if (!parent) {
		console.error('Running outside of frame!');
		window.stop();
	}
	if (!manifest.name || !manifest.version) {
		if (main) main.main.log('App error: no name or version!', 'error');
		window.stop();
	}
	// Disable cache for apps in dev mode
	if (manifest.dev && manifest.dev === true) {
		cache = '?v=' + main.system.guid();
	}
	appTitle = manifest.name;
	console.info('Running app \'' + manifest.name + '\' (' + manifest.version + ')...');
	if (main) {
		for (const item of main.processes) {
			if (item.name === manifest.name) {
				app = await main.processes[main.processes.indexOf(item)];
				app.path = '/apps/' + app.name + '.ap/';
			}
		}
		main.main.log('Loading app \'' + appTitle + '\'...', app);
	}
	// frameworks (external)
	for (const item of frameworks) {
		await Import.file('/lib/frameworks/' + item + '.min.js');
	}
	// apis (internal)
	for (const item of apis) {
		await Import.file('/lib/apis/' + item + '.js');
	}
	// app apis
	if (manifest.import) {
		for (const item of manifest.import) {
			await Import.api(item);
		}
	}
	// interface
	await Import.file('/lib/app.css');
	await Import.file('/lib/gui.css');
	// system font
	await Import.font('Signika');
	$('body').attr('style', '');
	$('form').on('submit', function (event) {
		event.preventDefault();
	});
	$(window).on('mousedown, mouseup, click', function () {
		main.apps.showWindow(app.id);
	});
	// app files
	await Import.file('/apps/' + manifest.name + '.ap/index.css' + cache);
	await Import.file('/apps/' + manifest.name + '.ap/index.js' + cache);
	// URL parameters
	let url_split = window.location.href.split('?');
	if (url_split[1]) {
		let params = url_split[1].split('&');
		params.forEach(function (param) {
			let key_value = param.split('=');
			let key = key_value[0];
			let value = key_value[1];
			get[key] = value;
		});
	}
	app.log('GET', 'info', get);
	App.ready();
});

let Import = {
	api: function (name) {
		let url = '/lib/apis/app/' + name + '.js';
		const head = document.getElementsByTagName('head')[0];
		const script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		head.appendChild(script);
		app.log('imported api ' + name + '...');
	},
	file: async function (url) {
		if (url.includes('js')) {
			const head = document.getElementsByTagName('head')[0];
			const script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', url);
			head.appendChild(script);
		} else {
			const head = document.getElementsByTagName('head')[0];
			const stylesheet = document.createElement('link');
			stylesheet.setAttribute('rel', 'stylesheet');
			stylesheet.setAttribute('href', url);
			head.appendChild(stylesheet);
		}
		app.log('imported ' + url + '...');
		await main.sleep(.1);
	},
	font: function (name) {
		let url = 'https://fonts.googleapis.com/css2?family=' + name + ':wght@400;500;700&display=swap';
		let xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				let css = xhr.responseText;
				css = css.replace(/}/g, 'font-display: swap; }');
				const head = document.getElementsByTagName('head')[0];
				const style = document.createElement('style');
				style.appendChild(document.createTextNode(css));
				head.appendChild(style);
				$('head').append('<style>html,body,button,select,input,textarea{font-family:' + name + ';}</style>');
				app.log('loaded font \'' + name + '\'');
			} else if (xhr.status !== 200) app.log('font \'' + name + '\' does not exist', 'error', xhr);
		};
		xhr.send();
	}
};

App = {
	is_ready: false,
	onReady(callback) {
		let checkReady = setInterval(function () {
			if (App.is_ready === true) {
				clearInterval(checkReady);
				callback();
			}
		}, 1000);
	},
	ready: function () {
		main.apps.ready(app.id);
		App.is_ready = true;
	}
};

Window = {
	show: function () {
		main.apps.start(app.id);
	},
	hide: function () {
		main.$('.window#' + app.id).hide();
	},
	close: function () {
		app.kill();
	},
	minimize: function () {
		main.$('.window#' + app.id + ' .window-bar .window-min').click();
	},
	title: function (title) {
		title = appTitle + ' &mdash; ' + title;
		document.title = title;
		$('title').html(title);
		app.log('title: ' + title);
	},
	get: function (key) {
		if (get[key]) {
			return get[key];
		}
		return false;
	},
	dialog: {
		hide() {
			$('.dialog').slideUp();
			$('.dialogs-container').fadeOut();
		},
		status: function (title, message) {
			$('.dialog-confirm,.dialog-cancel').hide().unbind();
			$('.dialogs-container').css('display', 'flex');
			$('.dialog').slideDown();
			$('.dialog-input').hide();
			$('.dialog h3').html(title);
			$('.dialog p').html(message);
		},
		message: function (title, message, confirm) {
			$('.dialog-confirm,.dialog-cancel').show().unbind();
			$('.dialogs-container').css('display', 'flex');
			$('.dialog').slideDown();
			$('.dialog-input').hide();
			$('.dialog h3').html(title);
			$('.dialog p').html(message);
			$('.dialog-cancel').hide();
			$('.dialog-confirm').on('click', function () {
				$('.dialog').slideUp();
				$('.dialogs-container').fadeOut();
				if (confirm) confirm();
			});
			$('.dialog-confirm').focus();
		},
		ask: function (title, message, confirm, cancel) {
			$('.dialog-confirm,.dialog-cancel').show().unbind();
			$('.dialogs-container').css('display', 'flex');
			$('.dialog').slideDown();
			$('.dialog-input').hide();
			$('.dialog h3').html(title);
			$('.dialog p').html(message);
			$('.dialog-cancel').show();
			$('.dialog-confirm').on('click', function () {
				$('.dialog').slideUp();
				$('.dialogs-container').fadeOut();
				confirm();
			});
			$('.dialog-cancel').on('click', function () {
				$('.dialog').slideUp();
				$('.dialogs-container').fadeOut();
				if (cancel) cancel();
			});
			$('.dialog-confirm').focus();
		},
		input: function (title, message, confirm, cancel) {
			$('.dialog-confirm,.dialog-cancel').unbind();
			$('.dialogs-container').css('display', 'flex');
			$('.dialog').slideDown();
			$('.dialog-input').show();
			$('.dialog h3').html(title);
			$('.dialog p').html(message);
			$('.dialog-cancel').show();
			$('.dialog-confirm').on('click', function () {
				$('.dialog').slideUp();
				$('.dialogs-container').fadeOut();
				confirm($('.dialog-input-textbox').val());
				$('.dialog-input-textbox').val('');
			});
			$('.dialog-cancel').on('click', function () {
				$('.dialog').slideUp();
				$('.dialogs-container').fadeOut();
				if (cancel) cancel();
			});
			$('.dialog-input-textbox').focus();
		}
	}
};