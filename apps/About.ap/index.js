$(function() {
  $("#name").html("<b>" + main.osname + "</b>");
  $("#version").html(main.version + ", build " + main.build);
  app.log(app.id);
});

function end() {
  app.kill();
}