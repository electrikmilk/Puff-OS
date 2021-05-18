var applet;

$(function() {
  main.apps.applet(app.name, manifest.applet);
  main.get_process(app.name + " Applet", function(process) {
    applet = process;
  });
});

let Applet = {
  reload: function() {
    main.$(".applet#" + app.id + " iframe").attr("src", $(".applet#" + app.id).attr("src"));
  },
  remove: function() {
    applet.kill();
  }
};