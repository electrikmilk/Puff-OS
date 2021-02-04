$(function() {
  $("form#terminal input").focus();
  $("form#terminal").on("submit", function() {
    var command = $("form#terminal input").val();
    $("form#terminal input").val("");
    if (!command) {
      $(".backlog ul").append("<li>></li>");
      return;
    }
    app.log(command);
    if (command === "clear") {
      $(".backlog ul").empty();
      return;
    }
    $(".backlog ul").append("<li>> " + command + "</li>");
    $("form#terminal input").prop("disabled", true);
    $("form#terminal").hide();
    application.title("running " + command + "...");
    main.network.request("/apps/Terminal.ap/shell", "POST", {
        command: command
      },
      function(response) {
        $("form#terminal")
        $("form#terminal input").prop("disabled", false)
        $("form#terminal").show();
        if (response.includes("error") || response.includes("not found")) {
          app.log(command, "error", response);
          application.title(command + " failed!");
          $(".backlog ul").append("<li class='response' id='error'>" + response + "</li>");
        } else {
          app.log(command, "success", response);
          application.title(command);
          if (response) $(".backlog ul").append("<li class='response'>" + response + "</li>");
        }
        $("form#terminal input").focus();
      },
      function(error) {
        $("form#terminal input").prop("disabled", false);
        $("form#terminal").show();
        application.title(command + " failed!");
        app.log("'" + command + "' command failed", "error", error);
        $(".backlog ul").append("<li class='response' id='error'>failed to run '" + command + "'</li>");
        $("form#terminal input").focus();
      }
    );
  });
  $(".backlog ul").append("<li>Welcome to " + main.osname + "! A web desktop. (" + main.version + ", build " + main.build + ")</li>");
  $("form#terminal input").val("help");
  $("form#terminal").submit();
});

function command(string) {
  $("form#terminal input").val(string);
  $("form#terminal").submit();
}