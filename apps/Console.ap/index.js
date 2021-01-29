$(function() {
  setInterval(function() {
    var list = "";
    main.log.forEach(function(item) {
      list += "<li>" + item + "</li>";
    });
    if ($(".output ul").html() !== list) $(".output ul").html(list);
  }, 500);
});