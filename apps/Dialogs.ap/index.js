$(function() {
  $(".message-dialog").on("click", function() {
    application.dialog.message("Here's a Title", "This is a message...",
      function() {
        output("User clicked OK");
      });
  });
  $(".ask-dialog").on("click", function() {
    application.dialog.ask("Here's a Title", "This is a message...",
      function() {
        output("User clicked OK");
      },
      function() {
        output("User clicked Cancel");
      });
  });
  $(".input-dialog").on("click", function() {
    application.dialog.input("Here's a Title", "This is a message...",
      function(text) {
        output("User clicked OK and entered: " + text);
      },
      function() {
        output("User clicked Cancel");
      });
  });
});

function output(log) {
  $(".output").append("<p>" + log + "</p>");
}

function end() {
  app.kill();
}