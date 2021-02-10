$(function() {
  // Do stuff before you show your app...
  app.log("I'm ready!");
  // Tell the system I'm ready to show my app
  Window.show();
  Window.dialog.message(false, "Hey there!", function() {
    app.log("Pressed OK!");
  });
});

// This will be called the user clicks the close button on your app
function close() {
  // Wrap up anything the app is doing
  Window.close();
}