$(function() {
  $(".contents").focus();
  Window.show();
  Menu.item("bold", function() {
    format('bold');
  });
  Menu.item("italic", function() {
    format('italic');
  });
  Menu.item("underline", function() {
    format('underline');
  });
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