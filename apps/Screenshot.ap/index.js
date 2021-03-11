$(function() {
  screenshot();
  Window.show();
});

function screenshot() {
  html2canvas(main.document.body).then(function(canvas) {
    document.querySelector(".output").appendChild(canvas);
  });
}

function close() {
  Window.close();
}