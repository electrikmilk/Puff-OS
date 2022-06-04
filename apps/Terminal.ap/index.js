const session = main.system.guid();
let last_command;

$(function () {
	$('form#terminal input').focus();
	$('form#terminal').on('submit', function () {
		let command = $('form#terminal input').val();
		$('form#terminal input').val('');
		if (!command) {
			signature(function (signature) {
				$('.backlog ul').append('<li>' + signature + '</li>');
			});
			return;
		}
		app.log(command);
		if (command === 'clear') {
			$('.backlog ul').empty();
			return;
		}
		signature(command, function (signature) {
			$('.backlog ul').append('<li>' + signature + ' ' + command + '</li>');
		});
		$('form#terminal input').prop('disabled', true);
		$('form#terminal').hide();
		Window.title(command);
		main.network.newRequest({
			url: app.path + 'shell',
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
				last_command = command;
				signature(function (signature) {
					$('#signature').html(signature);
				});
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
	fileMenu.add('Clear Terminal', function () {
		command('clear');
	});
	fileMenu.add('View Session History', function () {
		command('history list');
	});
	fileMenu.add('Clear history', function () {
		command('history clear');
	});
	fileMenu.divider();
	fileMenu.add('Previous command', ['up'], function () {
		$('form#terminal input').val(last_command);
	});
	command('help');
	Window.show();
});

function signature(command, callback) {
	if (!callback) {
		callback = command;
	}
	main.network.newRequest({
		url: app.path + 'signature',
		data: {
			session: session
		},
		success: function (signature) {
			callback(signature);
		}
	});
}

function command(string) {
	$('form#terminal input').val(string);
	$('form#terminal').submit();
}

function close() {
	Window.close();
}