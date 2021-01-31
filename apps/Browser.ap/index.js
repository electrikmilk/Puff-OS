var metadata = {};

function finish(status, favicon) {
  if (status === true) {
    metadata['title'] = document.querySelector("iframe").contentWindow.title;
    if (favicon) metadata['favicon'] = favicon;
    app.log(metadata);
    $(".info").html("<img src='" + metadata['favicon'] + "' width='16' height='16'/><span>" + metadata['title'] + "</span>");
  }
}

function start() {

}

function end() {

}