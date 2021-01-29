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
    main.network.request("/apps/Terminal.ap/shell", "POST", {
        command: command
      },
      function(response) {
        $("form#terminal")
        $("form#terminal input").prop("disabled", false)
        $("form#terminal").show();
        if (response.includes("error") || response.includes("not found")) {
          app.log("command (" + command + ")", "error", response);
          $(".backlog ul").append("<li class='response' id='error'>" + response + "</li>");
        } else {
          app.log("command (" + command + ")", "success", response);
          if (response) $(".backlog ul").append("<li class='response'>" + response + "</li>");
        }
        $("form#terminal input").focus();
      },
      function(error) {
        $("form#terminal input").prop("disabled", false);
        $("form#terminal").show();
        app.log("command failed", "error", error);
        $(".backlog ul").append("<li class='response' id='error'>failed to run '" + command + "'</li>");
        $("form#terminal input").focus();
      }
    );
  });
  $(".backlog ul").append("<li>Welcome to " + main.osname + "! A web desktop. (" + main.version + ", build " + main.build + ")</li>");
  $("form#terminal input").val("help");
  $("form#terminal").submit();
});