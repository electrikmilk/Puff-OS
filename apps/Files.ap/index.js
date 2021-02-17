$(function() {
  var viewMenu = new Menu("View");
  viewMenu.add("list", "As List", function() {

  });
  viewMenu.add("icons", "As Icons", function() {

  });
  fileMenu.divider();
  fileMenu.add("newfolder", "New Folder", function() {

  });
  fileMenu.add("newfile", "New File", function() {

  });
  Window.show();
});

function close() {
  Window.close();
}