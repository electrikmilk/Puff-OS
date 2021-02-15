var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
var memorycheck;

$(function() {
  if (performance.memory) {
    getMemory = setInterval(function() {
      var report = "<div><h3>" + main.memory.limit + "</h3><p>Heap Size Limit</p></div>";
      report += "<div><h3>" + main.memory.total + "</h3><p>Total Heap Size</p></div>";
      report += "<div><h3>" + main.memory.used + "</h3><p>Used Heap Size</p></div>";
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