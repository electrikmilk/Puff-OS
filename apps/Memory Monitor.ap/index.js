var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
var memorycheck;
var memory = {};

$(function() {
  // var applet = new Applet("");
  if (performance.memory) {
    getMemory = setInterval(function() {
      systemMemory = main.systemMemory;
      memory.total = main.files.formatBytes(systemMemory.totalJSHeapSize);
      memory.used = main.files.formatBytes(systemMemory.usedJSHeapSize);
      memory.limit = main.files.formatBytes(systemMemory.jsHeapSizeLimit);
      memory.percent = parseInt(memory.total.split(" ")[0]) - (parseInt(memory.total.split(" ")[0]) - parseInt(memory.used.split(" ")[0]));
      var report = "<div><h3>" + memory.limit + "</h3><p>Heap Size Limit</p></div>";
      report += "<div><h3>" + memory.total + "</h3><p>Total Heap Size</p></div>";
      report += "<div><h3>" + memory.used + "</h3><p>Used Heap Size</p></div>";
      $(".stats").html(report);
      $("progress").attr("max", main.systemMemory.totalJSHeapSize).val(main.systemMemory.usedJSHeapSize);
    }, 1000);
  } else {
    Window.dialog.message(false, "This feature is not supported by your browser.", function() {
      Window.close();
    });
  }
  Window.show();
});

function close() {
  if (getMemory) clearInterval(getMemory);
  Window.close();
}