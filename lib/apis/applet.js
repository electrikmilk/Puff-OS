/* Applet API */
console.time('[applet] DOM load');
let frameworks = ['jquery'];
let apis = ['cursor'];
let main = parent;

let applet; // define applet instance

document.addEventListener('DOMContentLoaded', async function () {
	console.timeEnd('[applet] DOM load');
	if (!parent) {
		console.error('Running outside of frame!');
		window.stop();
	}
	if (!manifest.name || !manifest.version) {
		if (parent) {
			main.main.log('Applet error: no name or version!', 'error');
		}
	}
	appTitle = manifest.name;
	console.info('Creating applet for \'' + manifest.name + '\' (' + manifest.version + ')...');
	if (main) {
		for (const item of main.processes) {
			if (item.name === manifest.name + ' Applet') {
				applet = await main.processes[main.processes.indexOf(item)];
			}
		}
	}
	// frameworks (external)
	for (const item of frameworks) {
		await Import.file('/lib/frameworks/' + item + '.min.js');
	}
	// apis (internal)
	for (const item of apis) {
		await Import.file('/lib/apis/' + item + '.js');
	}
	// interface
	await Import.file('/lib/applet.css');
	await Import.file('/lib/gui.css');
	// system font
	await Import.font('Signika');
	$('body').attr('style', '');
	$('form').on('submit', function (event) {
		event.preventDefault();
	});
	$(window).on('mousedown, mouseup, click', function () {
		main.apps.showWindow(applet.id);
	});
	// app files
	await Import.file('/apps/' + manifest.name + '.ap/index.css');
	await Import.file('/apps/' + manifest.name + '.ap/applet/index.js');
});

let Import = {
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
		applet.log('imported ' + url + '...');
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
				applet.log('loaded font \'' + name + '\'');
			} else if (xhr.status !== 200) app.log('font \'' + name + '\' does not exist', 'error', xhr);
		};
		xhr.send();
	}
};