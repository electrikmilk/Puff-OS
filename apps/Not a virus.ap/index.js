var idontwanttoclose = true;

$(function() {
  app.log(main.system.guid(10000));
});

function end() {
  if (!idontwanttoclose) {
    app.kill();
  }
}