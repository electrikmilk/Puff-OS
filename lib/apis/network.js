var network = {
  connection: function() {
    return navigator.connection;
  },
  type: function() {
    return navigator.connection.effectiveType;
  },
  wentOnline: function(callback) {
    document.addEventListener("online", callback, false);
  },
  wentOffline: function(callback) {
    document.addEventListener("offline", callback, false);
  },
  online: function() {
    return navigator.onLine ? true : false;
  },
  request: function(url, type = "POST", fields = {}, success, error) {
    var request = new Process("network.request");
    if (url) {
      var data = {};
      if (fields) data = fields;
      $.ajax({
        type: type,
        url: url,
        data: data,
        success: function(response) {
          request.log("network.request successful", "success", response);
          if (success) success(response);
        },
        error: function(errorresponse) {
          request.log("network.request failed", "error", errorresponse);
          if (error) error(errorresponse);
        }
      });
    }
    request.kill();
  },
  ping: function(url, callback, errorcallback) {
    var ping = new Process("network.ping");
    system.stopwatch("network.ping: " + url);
    network.request("lib/server",
      function(response) {
        ping.log("'" + url + "' response", "info", response);
        system.stopwatch("ping " + url, false);
        if (callback) callback();
      },
      function(error) {
        ping.log("network.ping failed", "error", error);
        system.stopwatch("network.ping: " + url, false);
        if (errorcallback) errorcallback();
      }, "GET", "ping");
    ping.kill();
  }
}