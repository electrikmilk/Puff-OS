var metadata = {};

$(function() {
  $("form#address").on("submit", function() {
    var url = $("#url").val();
    if (url) {
      if (!url.includes("http")) url = "https://" + url;
      document.querySelector("iframe").src = "/apps/Browser.ap/webpage?url=" + url;
      application.title = url;
    }
  });
  Window.show();
});

function finish(status, favicon) {
  if (status === true) {
    metadata['title'] = document.querySelector("iframe").contentWindow.title;
    if (favicon) metadata['favicon'] = favicon;
    app.log(metadata);
    $(".info").html("<img src='" + metadata['favicon'] + "' width='16' height='16'/><span>" + metadata['title'] + "</span>");
  }
}

function close() {
  Window.close();
}