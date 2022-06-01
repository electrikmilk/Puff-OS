version = 'alpha 0.1.0';
build = '3';
osname = 'Puff OS';
let clipText;
let apis = ['network', 'files', 'device', 'audio', 'system', 'video', 'cursor', 'clock'];
let frameworks = ['jquery', 'jquery-ui', 'bootstrap', 'mousetrap', 'html2canvas'];

demo = true;
processes = [];
desktop = null;
log = [];
cantkill = ['system', 'desktop', 'videoAPI', 'audioAPI', 'memoryd', 'watchdogd', 'Sound Applet', 'Network Applet'];
unresponsive = [];
reported = [];

console.time('startup');
console.time('window.load');
console.time('uptime');

window.onload = async function () {
	// Open in popup, if in popup go fullscreen
	// if (window.opener && window.opener !== window) {
	// 	let requestFullscreen = setInterval(function () {
	// 		if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
	// 			clearInterval(requestFullscreen);
	// 		} else {
	// 			fullscreen(document.documentElement);
	// 		}
	// 	}, 2500);
	// } else {
	// 	document.querySelector(".in-popup").style.display = "flex";
	// 	openWindow();
	// 	window.stop();
	// }
	try {
		bootFace('success');
		console.timeEnd('window.load');
		console.info('version: ' + version + ', build: ' + build);
		// interface
		await importFile('lib/main.css');
		await importFile('lib/gui.css');
		// frameworks (external)
		for (const item of frameworks) {
			await importFile('lib/frameworks/' + item + '.min.js');
		}
		// apis (internal)
		for (const item of apis) {
			await importFile('lib/apis/' + item + '.js');
		}
		document.querySelector('.boot').innerHTML = '<div class=\'loader\'></div>';
		// we made it!
	} catch (err) {
		console.error('[init]: ' + err.message);
		bootFace('crash');
		bootLog('Whoops!<br/><br/><code>' + err.message + '</code>');
	}
};

async function importFile(url) {
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
	console.info(`imported ${url}...`);
	await sleep(0.1);
}

function openWindow() {
	window.open(window.location.href, 'view', 'menubar=0,statusbar=0');
}

function fullscreen(elem) {
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) {
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}
}

function random(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.substring(1, string.length);
}

function end(array) {
	return array[array.length - 1];
}

async function sleep(s) {
	s = s * 1000;
	return new Promise(resolve => setTimeout(resolve, s));
}

function bootFace(src) {
	document.querySelector('.reaction').src = '/res/icons/' + src + '.svg';
}

function bootLog(log) {
	let text = document.querySelector('.boot p');
	if (text) {
		text.innerHTML = log;
	}
}