var files = {
  pathinfo: function(path) {
    var parts = path.split("/");
    var filename = parts[parts.length - 1];
    var basename = parts[parts.length - 1].split(".")[0];
    var dots = filename.split(".");
    var ext = dots[dots.length - 1]
    return {
      basename: basename,
      filename: filename,
      ext: ext
    };
  },
  formatBytes: function(a, b = 2) {
    // https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    if (0 === a) return "0 Bytes";
    const c = 0 > b ? 0 : b,
      d = Math.floor(Math.log(a) / Math.log(1024));
    return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d];
  }
}