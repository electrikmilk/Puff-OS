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
  $(".volume").on("change", function() {
    audio.element.volume = $(this).val();
  });
  setInterval(function() {
    $(".volume").val(audio.element.volume);
  }, 1500);
}

function end() {
  app.kill();
}