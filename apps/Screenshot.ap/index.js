$(function() {
  screenshot();
});

function screenshot() {
  html2canvas(main.document.body).then(function(canvas) {
    document.querySelector(".output").appendChild(canvas);
  });
}