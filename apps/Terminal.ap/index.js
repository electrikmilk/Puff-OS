let session = main.system.guid();
let last_command;

$(function () {
	$('#session_id').html(session);
	$('form#input input').focus();
	$('form#input').on('submit', function () {
		let command = $('form#input input').val();
		$('form#input input').val('');
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
		$('form#input input').prop('disabled', true);
		$('form#input').hide();
		Window.title(command);
		main.network.newRequest({
			url: app.path + 'shell',
			data: {
				command: command,
				session: session
			},
			success: function (response) {
				$('form#input');
				$('form#input input').prop('disabled', false);
				$('form#input').show();
				if (response.includes('error') || response.includes('not found')) {
					app.log(command, 'error', response);
					Window.title(command + ' failed!');
					$('.backlog ul').append('<li class=\'response color-red\'>' + response + '</li>');
				} else {
					app.log(command, 'success', response);
					if (response) $('.backlog ul').append('<li class=\'response\'>' + response + '</li>');
				}
				$('html, body').scrollTop($(document).height());
				$('form#input input').focus();
				last_command = command;
				signature(function (signature) {
					$('#signature').html(signature);
				});
			},
			error: function (error) {
				$('form#input input').prop('disabled', false);
				$('form#input').show();
				Window.title(command + ' failed!');
				app.log('\'' + command + '\' command failed', 'error', error);
				$('.backlog ul').append('<li class=\'response color-red\'>failed to run \'' + command + '\'</li>');
				$('form#input input').focus();
			}
		});
	});
	$('.backlog ul').append('<li>Welcome to ' + main.osname + '! A web desktop. (' + main.version + ', build ' + main.build + ')</li>');
	fileMenu.divider();
	fileMenu.add('Clear Terminal', function () {
		command('clear');
	});
	fileMenu.add('View Session History', function () {
		command('session history');
	});
	fileMenu.add('Clear Session History', function () {
		command('session clear');
	});
	fileMenu.divider();
	fileMenu.add('Previous command', ['up'], function () {
		$('form#input input').val(last_command);
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
	$('form#input input').val(string);
	$('form#input').submit();
}

function close() {
	Window.close();
}