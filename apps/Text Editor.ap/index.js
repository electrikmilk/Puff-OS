$(function() {
  var formatMenu = new Menu("Format");
  formatMenu.add("bold", "Bold", function() {
    format('bold');
  });
  formatMenu.add("italic", "Italic", function() {
    format('italic');
  });
  formatMenu.add("underline", "Underline", function() {
    format('underline');
  });
  formatMenu.add("strikeThrough", "Strike-through", function() {
    format('strikeThrough');
  });
  Window.show();
  $(".contents").focus();
});

function close() {
  Window.close();
}

function format(type) {
  if (type === "CreateLink") {
    Window.dialog.input(false, "Enter URL:", function(url) {
      if (response) {
        $(".contents").focus();
        document.execCommand("CreateLink", false, url);
      }
    });
    return;
  }
  document.execCommand(type);
}