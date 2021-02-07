var audio;

$(function() {
  audio = main.apps.audio(app);
  if (file) load(file);
});

function load(url) {
  audio.set([url]);
  $(".play").on("click", function() {
    audio.element.play();
  });
  $(".pause").on("click", function() {
    audio.element.pause();
  });
  $(".stop").on("click", function() {
    audio.element.stop();
  });
}