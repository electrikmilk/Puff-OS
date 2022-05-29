files = {
	formatBytes: function (bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}
};

function AppFile(path) {
	return new Files(path);
}

class Files {
	constructor(path) {
		this.path = path;
	}

	read(callback) {
		network.newRequest({
			url: 'lib/server',
			data: {
				action: 'files/read',
				path: this.path
			},
			success: function (response) {
				main.log('Loaded content for ' + this.path);
				callback(response);
			},
			error: function (error) {
				callback(false);
				main.log('Error loading content for ' + this.path, 'error', error);
			}
		});
	}

	write(content, callback) {
		network.newRequest({
			url: 'lib/server',
			data: {
				action: 'files/save',
				content: content,
				path: this.path
			},
			success: function (response) {
				main.log('Loaded content for ' + this.path);
				callback(true);
			},
			error: function (error) {
				main.log('Error loading content for ' + this.path, 'error', error);
				callback(false);
			}
		});
	}

	info() {
		let parts = this.path.split('/');
		let basename = parts[parts.length - 1];
		let filename = parts[parts.length - 1].split('.')[0];
		let ext = end(basename.split('.'));
		return {
			basename: basename, filename: filename, ext: ext
		};
	}
}