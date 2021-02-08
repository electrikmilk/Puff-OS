$(function() {
  main.start(app.id);
  app.log("I'm ready!");
});

function end() {
  app.kill();
}