$(function() {
  if (main.system.storage.get("session")) {
    app.log("User is already logged in, closing...");
    Window.close();
  } else {
    var users = main.system.storage.get("users"); // get previously logged in users
    if (users) {
      if (users.length > 1) {
        $(".user-list").css("display", "grid");
      } else {
        // load user
        var user = users[0];
        $(".user-login").fadeIn();
      }
    } else {
      $(".user-setup").fadeIn();
    }
    Window.show();
  }
  $(".refresh-login, .back").on("click", function() {
    Window.dialog.ask(false, "Are you sure?", function() {
      main.apps.open('Login', true);
      Window.close();
    });
  });
  $(".register").on("click", function() {
    $(".user-list,.user-login,.user-setup").fadeOut();
    $(".user-register").fadeIn();
    $(".login-help").fadeOut();
  });
  $(".demo").on("click", function() {
    Window.dialog.ask("Demo Mode", "For first time users wanting to try <b>" + main.osname + "</b> out!", function() {
      main.system.demo();
    });
  });
});

function close() {
  Window.close();
}