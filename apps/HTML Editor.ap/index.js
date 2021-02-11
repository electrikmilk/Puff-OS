$(function() {
  // var editMenu = new Menu("Edit");
  // editMenu.add("findreplace", "Find & Replace", function() {
  //
  // });
  // editMenu.add("findfile", "Find in Project", function() {
  //
  // });
  $("textarea").on("keyup", function() {
    update();
  });
  Window.show();
  Window.title("test.html");
  $("textarea").focus();
});

function update() {
  $("iframe").attr("src", "data:text/html," + $("textarea").val());
}

function close() {
  Window.close();
}