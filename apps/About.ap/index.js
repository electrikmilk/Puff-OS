$(function() {
  $("#name").html("<b>" + main.osname + "</b>");
  $("#version").html(main.version + ", build " + main.build);
  Window.show();
});

function close() {
  Window.close();
}