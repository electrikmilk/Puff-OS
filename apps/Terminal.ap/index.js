$(function() {
  $("form#terminal input").focus();
  $("form#terminal").on("submit", function() {
    var command = $("form#terminal input").val();
    app.log(command);
    if (command === "clear") {
      $(".backlog ul").html("<li><i>console was cleared</i></li>");
      return;
    }
    $(".backlog ul").append("<li>> " + command + "</li>");
    parent.console.log(command);
    $("form#terminal input").val("");
  });
});

function start() {

}

function end() {

}