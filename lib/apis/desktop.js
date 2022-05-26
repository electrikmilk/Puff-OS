let toolbarTimeout;
let applets = ['Sound', 'Network', 'Screenshot'];
let options = {
	about: {
		label: 'About this device',
		onClick: 'apps.open(&quot;DeviceInfo&quot;)',
		divider: true
	},
	tips: {
		label: 'Tips & Tricks',
		onClick: 'apps.open(&quot;Tips&quot;)',
		divider: true
	},
	refresh: {
		label: 'Reload',
		onClick: 'system.refresh()'
	},
	logout: {
		label: 'Logout',
		onClick: 'system.logout()'
	},
	exit: {
		label: 'Exit',
		onClick: 'system.exit()'
	}
};

$(function () {
	// load in system menu
	for (let key in options) {
		$('.system-menu .menubar-menu ul').append('<li onclick=\'' + options[key].onClick + '\'>' + options[key].label + '</li>');
		if (options[key].divider === true) {
			$('.system-menu .menubar-menu ul').append('<hr/>');
		}
	}
	// if set wallpaper, load it
	desktop.log('Loading wallpaper...');
	let setWallpaper = system.storage.get('wallpaper');
	if (setWallpaper) {
		system.wallpaper.image(setWallpaper);
	} else {
		system.wallpaper.image('res/wallpapers/default.jpg');
	}
	apps.list(); // load in list of apps to toolbar
	network.request('lib/server', 'POST', {
			action: 'all_apps'
		},
		function (response) {
			$('.system-menu .menubar-menu ul').append(response);
		},
		function (error) {
			desktop.log('unable to load list of apps', 'error');
		}
	);
	// load default applets
	applets.forEach((name) => {
		apps.manifest(name, function (app) {
			apps.applet(name, app.applet);
		});
	});
	// start checking window title changes
	setInterval(function () {
		if ($('.window:not(.minimized)').length !== 0) {
			$('.window:not(.minimized)').each(function (index, item) {
				let title = $(this).find('iframe').contents().find('title').html();
				$(this).find('.window-title > div > div:last-child').html(title);
			});
		}
	}, 1000);
	setTimeout(function () {
		apps.open('Welcome');
	}, 1000);
	// $(".toolbar-container").on("mouseover", function() {
	//   $(this).addClass("open");
	//   if (toolbarTimeout) clearTimeout(toolbarTimeout);
	//   toolbarTimeout = setTimeout(function() {
	//     $(".toolbar-container").removeClass("open");
	//   }, 3000);
	// });
	// Enter fullscreen
	let requestFullscreen = setInterval(function () {
		if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
			clearInterval(requestFullscreen);
		} else {
			fullscreen(document.documentElement);
		}
	}, 2500);
});