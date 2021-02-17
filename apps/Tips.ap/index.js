var tips = [
  "App list is in the system/puff menu (the cloud icon, top left).",
  "Basic apps in the toolbar/launcher at the bottom.",
  "Launch new instance of an app by clicking on an app and going to File > New window.",
  "Show all windows for an app by going to Window > Show all windows",
  "Each window has it's own menus in the top menubar, click on a window to show it's menubar"
];

$(function() {
  Window.show();
  tips.forEach((item, i) => {
    $("ul").append("<li>" + item + "</li>");
  });
});

function close() {
  Window.close();
}