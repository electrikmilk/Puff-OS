// Graphics & Video API
// Support for webcam stream, audio stream, pdf viewing, camera, livestreams?

let video_api = new Process("videoAPI");

if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
	// Firefox 38+ seems having support of enumerateDevicesx
	navigator.enumerateDevices = function (callback) {
		navigator.mediaDevices.enumerateDevices().then(callback);
	};
} else video_api.log("mediaDevices failed!", "error");

let MediaDevices = [];
let isHTTPs = location.protocol === "https:";
let canEnumerate = false;

if (typeof MediaStreamTrack !== "undefined" && "getSources" in MediaStreamTrack) {
	canEnumerate = true;
} else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
	canEnumerate = true;
}

let hasMicrophone = false;
let hasSpeakers = false;
let hasWebcam = false;

let isMicrophoneAlreadyCaptured = false;
let isWebcamAlreadyCaptured = false;

function checkDeviceSupport(callback) {
	if (!canEnumerate) {
		return;
	}
	if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
		navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
	}
	if (!navigator.enumerateDevices && navigator.enumerateDevices) {
		navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
	}
	if (!navigator.enumerateDevices) {
		if (callback) {
			callback();
		}
		return;
	}
	MediaDevices = [];
	navigator.enumerateDevices(function (devices) {
		devices.forEach(function (_device) {
			let device = {};
			for (let d in _device) {
				device[d] = _device[d];
			}
			if (device.kind === "audio") {
				device.kind = "audioinput";
			}
			if (device.kind === "video") {
				device.kind = "videoinput";
			}
			let skip;
			MediaDevices.forEach(function (d) {
				if (d.id === device.id && d.kind === device.kind) {
					skip = true;
				}
			});
			if (skip) {
				return;
			}
			if (!device.deviceId) {
				device.deviceId = device.id;
			}
			if (!device.id) {
				device.id = device.deviceId;
			}
			if (!device.label) {
				device.label = "Please invoke getUserMedia once.";
				if (!isHTTPs) {
					device.label = "HTTPs is required to get label of this " + device.kind + " device.";
				}
			} else {
				if (device.kind === "videoinput" && !isWebcamAlreadyCaptured) {
					isWebcamAlreadyCaptured = true;
				}
				if (device.kind === "audioinput" && !isMicrophoneAlreadyCaptured) {
					isMicrophoneAlreadyCaptured = true;
				}
			}
			if (device.kind === "audioinput") {
				hasMicrophone = true;
			}
			if (device.kind === "audiooutput") {
				hasSpeakers = true;
			}
			if (device.kind === "videoinput") {
				hasWebcam = true;
			}
			// there is no 'videoouput' in the spec.
			MediaDevices.push(device);
		});
		if (callback) {
			callback();
		}
	});
}

// Check for camera + microphone support
checkDeviceSupport(function () {
	video_api.log("webcam available: " + hasWebcam);
	video_api.log("microphone available: " + hasMicrophone);
	// log("ruby","webcamCaptured: "+isWebcamAlreadyCaptured);
	// log("ruby","microphoneCaptured: "+isMicrophoneAlreadyCaptured);
});

let videoStream;
let audioStream;

video = {
	webcam: function (app, selector, audio = false) {
		let iframe = document.querySelector(".window#" + app.id + " .window-content iframe");
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: audio
		}).then((stream) => {
			videoStream = stream;
			iframe.contentWindow.document.querySelector(selector).srcObject = stream;
			return true;
		}).catch(error => video_api.log("webcam: getUserMedia() error", "error", error));
	},
	microphone: function (app, selector) {
		let iframe = document.querySelector(".window#" + app.id + " .window-content iframe");
		navigator.mediaDevices.getUserMedia({
			audio: true
		}).then(stream => {
			iframe.contentWindow.document.querySelector(selector).src = stream;
			audioStream = stream;
			return true;
		}).catch(error => video_api.log("microphone: getUserMedia() error", "error", error));
	}
};