var memory = {};
if (performance.memory) {
  applet.log("supported", "success", performance.memory);
} else {
  window.stop();
}
var memorycheck = setInterval(function() {
  var systemMemory = main.systemMemory;
  memory.total = main.files.formatBytes(systemMemory.totalJSHeapSize);
  memory.used = main.files.formatBytes(systemMemory.usedJSHeapSize);
  memory.limit = main.files.formatBytes(systemMemory.jsHeapSizeLimit);
  memory.percent = parseInt(memory.total.split(" ")[0]) - (parseInt(memory.total.split(" ")[0]) - parseInt(memory.used.split(" ")[0]));
  $(".memory progress").attr("max", systemMemory.totalJSHeapSize).val(systemMemory.usedJSHeapSize);
  var percent = Math.round(100 - (((systemMemory.totalJSHeapSize - systemMemory.usedJSHeapSize) / systemMemory.totalJSHeapSize) * 100));
  $(".memory span").html("Memory (" + percent + "%)");
}, 1000);