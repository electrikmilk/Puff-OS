$(function() {
  $("#name").html("<b>" + main.osname + "</b>");
  $("#version").html(main.version + ", build " + main.build);
  $("#report-form").on("submit", function(e) {
    e.preventDefault();
    var name = $("input[name=name]").val();
    var version = $("input[name=version]").val();
    var message = $("textarea").val();
    if (message) {
      Window.dialog.ask("Submit Report", "Ready to submit this report?",
        function() {
          setTimeout(function() {
            main.network.request("/apps/Report Bug.ap/submit.php", "POST", {
                name: name,
                version: version,
                message: message
              },
              function(response) {
                $("textarea").val("");
                Window.dialog.message("Thanks!", "Your report was submitted. We'll take a look and try to get that fixed.", function() {
                  Window.close();
                });
              },
              function(error) {
                app.log("submit report error", "error", error);
                Window.dialog.message("Whoops!", "An error occurred submitting your report.");
              }
            );
          }, 500);
        }
      );
    } else {
      Window.dialog.message("Report incomplete", "Please enter details of the error so we can fix it.");
    }
  });
  Window.show();
  $("textarea").focus();
});

function close() {
  Window.close();
}