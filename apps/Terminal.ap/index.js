const session = main.system.guid();

$(function () {
	// These aren't working for now...
	// Window.menu("applist", function() {
	//   command("app list");
	// });
	// Window.menu("net", function() {
	//   command("net");
	// });
	// Window.menu("top", function() {
	//   command("top");
	// });
	// Window.menu("clear", function() {
	//   command("clear");
	// });
	// Window.menu("help", function() {
	//   command("help");
	// });
	$('form#terminal input').focus();
	$('form#terminal').on('submit', function () {
		let command = $('form#terminal input').val();
		$('form#terminal input').val('');
		if (!command) {
			$('.backlog ul').append('<li>$</li>');
			return;
		}
		app.log(command);
		if (command === 'clear') {
			$('.backlog ul').empty();
			return;
		}
		$('.backlog ul').append('<li>$ ' + command + '</li>');
		$('form#terminal input').prop('disabled', true);
		$('form#terminal').hide();
		Window.title(command);
		main.network.newRequest({
			url: '/apps/Terminal.ap/shell',
			data: {
				command: command,
				session: session
			},
			success: function (response) {
				$('form#terminal');
				$('form#terminal input').prop('disabled', false);
				$('form#terminal').show();
				if (response.includes('error') || response.includes('not found')) {
					app.log(command, 'error', response);
					application.title(command + ' failed!');
					$('.backlog ul').append('<li class=\'response\' id=\'error\'>' + response + '</li>');
				} else {
					app.log(command, 'success', response);
					if (response) $('.backlog ul').append('<li class=\'response\'>' + response + '</li>');
				}
				$('html, body').scrollTop($(document).height());
				$('form#terminal input').focus();
			},
			error: function (error) {
				$('form#terminal input').prop('disabled', false);
				$('form#terminal').show();
				Window.title(command + ' failed!');
				app.log('\'' + command + '\' command failed', 'error', error);
				$('.backlog ul').append('<li class=\'response\' id=\'error\'>failed to run \'' + command + '\'</li>');
				$('form#terminal input').focus();
			}
		});
	});
	$('.backlog ul').append('<li>Welcome to ' + main.osname + '! A web desktop. (' + main.version + ', build ' + main.build + ')</li>');
	fileMenu.divider();
	fileMenu.add('New Console', function () {
		main.apps.open('Console', true);
	});
	fileMenu.add('New Audio Manager', function () {
		main.apps.open('Audio Manager', true);
	});
	fileMenu.add('New Process Manager', function () {
		main.apps.open('Process Manager', true);
	});
	fileMenu.add('New Memory Monitor', function () {
		main.apps.open('Monitor Monitor', true);
	});
	command('help');
	Window.show();
});

function command(string) {
	$('form#terminal input').val(string);
	$('form#terminal').submit();
}

function close() {
	Window.close();
}