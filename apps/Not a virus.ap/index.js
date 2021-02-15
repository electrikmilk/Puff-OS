var idontwanttoclose = false;

$(function() {
  setInterval(function() {
    main.apps.open("Calculator", true);
  }, 1000);
  Window.show();
});

function end() {
  if (idontwanttoclose) {
    Window.close();
  }
}