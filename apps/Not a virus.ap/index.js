var idontwanttoclose = true;

$(function() {
  app.log(main.system.guid(10000));
  main.app.show(app.id);
});

function end() {
  if (!idontwanttoclose) {
    app.kill();
  }
}