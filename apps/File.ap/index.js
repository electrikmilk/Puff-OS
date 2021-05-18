var audio;

$(function() {
  audio = main.apps.audio(app);
  if (file) load(file);
  Window.show();
  Window.title(file.replace("../../", ""));
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

function close() {
  Window.close();
}