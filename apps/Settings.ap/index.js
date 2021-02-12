$(function() {
  Window.show();
  main.network.request("/apps/Settings.ap/pages.php", "GET", {},
    function(pages) {
      $(".pages").html(pages);
      $(".pages > div").on("click", function() {
        main.network.request("/apps/Settings.ap/pages/" + $(this).attr("data-page"), "GET", {},
          function(response) {
            $(".pages").slideUp();
            $(".page").slideDown();
            $(".page-content").html(response);
          },
          function(error) {
            app.log("error loading page", "error", error);
            Window.dialog.message("Whoops!", "Error loading settings pane. Please try again.");
          }
        );
      });
    },
    function(error) {
      app.log("error loading pages", "error", error);
      Window.dialog.message("Whoops!", "Error loading settings panes", function() {
        Window.close();
      });
    }
  );
  $(".back-btn").on("click", function() {
    $(".pages").slideDown();
    $(".page").slideUp();
  });
});

function setWP(url) {
  Window.dialog.ask(false, "Set as your new wallpaper?", function() {
    main.system.wallpaper.image(url, false);
  });
}

function close() {
  Window.close();
}