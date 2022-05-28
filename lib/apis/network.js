network = {
	connection: function () {
		return navigator.connection;
	},
	type: function () {
		return navigator.connection.effectiveType;
	},
	wentOnline: function (callback) {
		document.addEventListener('online', callback, false);
	},
	wentOffline: function (callback) {
		document.addEventListener('offline', callback, false);
	},
	online: function () {
		return navigator.onLine;
	},
	request: function (url, type = 'POST', fields = {}, success, error, datatype = false) {
		let request = new Process('network.request');
		if (url) {
			let data = {};
			if (fields) data = fields;
			$.ajax({
				type: type,
				url: url,
				data: data,
				dataType: datatype,
				success: function (response) {
					request.log('network.request successful', 'success', response);
					if (success) success(response);
				},
				error: function (error_response) {
					request.log('network.request failed', 'error', error_response);
					if (error) error(error_response);
				}
			});
		}
		request.kill();
	},
	newRequest: function (options = {}) {
		let request = new Process('network.request');
		if (options.url) {
			$.ajax({
				type: options.type ?? 'POST',
				url: options.url,
				data: options.data,
				dataType: options.dataType,
				success: function (response) {
					request.log('network.request successful', 'success', response);
					if (options.success) options.success(response);
				},
				error: function (error_response) {
					request.log('network.request failed', 'error', error_response);
					if (options.error) options.error(error_response);
				}
			});
		}
		request.kill();
	},
	ping: function (url, callback, errorcallback) {
		let ping = new Process('network.ping');
		system.stopwatch('network.ping: ' + url);
		network.request('lib/server',
			function (response) {
				ping.log('\'' + url + '\' response', 'info', response);
				system.stopwatch('ping ' + url, false);
				if (callback) callback();
			},
			function (error) {
				ping.log('network.ping failed', 'error', error);
				system.stopwatch('network.ping: ' + url, false);
				if (errorcallback) errorcallback();
			}, 'GET', 'ping');
		ping.kill();
	}
};