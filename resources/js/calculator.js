$(document).ready(function() {

  $('#calculator-form').submit(function(e){
    e.preventDefault();
    if ($(window).width() < 768) {
      $('html, body').animate({
        scrollTop: $("#result").offset().top - 70
      }, 550, $.bez([0.22, 0.61, 0.35, 1]));
    }
  });
});
