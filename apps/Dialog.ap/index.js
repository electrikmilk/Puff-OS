$(function() {
  $(".ok-btn").on("click", function() {
    setTimeout(function() {
      Window.close();
    }, 500);
  });
  $(".cancel-btn").on("click", function() {
    Window.close();
  });
  $(".ok-btn").focus();
  Window.show();
});