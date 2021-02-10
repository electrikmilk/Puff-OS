var video = document.querySelector("video");
var canvas = document.querySelector("canvas");

$(function() {
  main.video.webcam(app, "video");
  Window.show();
});

function snap() {
  var width = video.getBoundingClientRect().width;
  var height = video.getBoundingClientRect().height;
  console.log(width + "x" + height);
  canvas.getContext("2d").drawImage(video, 0, 0, width, height, 0, 0, width, height);
  var img = canvas.toDataURL("image/png");
  $("canvas").show();
}

function close() {
  Window.close();
}