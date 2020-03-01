$(document).ready(function() {


  $('#calculator-form').submit(function(e){
    e.preventDefault();
    $("#orderBtn").removeClass("disabled");
    $("#phoneLink").removeClass("disabled");
    $("#emailLink").removeClass("disabled");
    $(".delimeter-container").removeClass("disabled");
    $("#calcSubmitBtn").attr('disabled', 'disabled');
    $(".server-wait").show();
    if ($(window).width() < 768) {
      $('html, body').animate({
        scrollTop: $("#result").offset().top - 70
      }, 550, $.bez([0.22, 0.61, 0.35, 1]));
    }

    function validationSuccess() {
      $("#calcSubmitBtn").removeAttr("disabled");
      $("#calcSubmitBtn").html("Přepočítat");
      $("#calcSubmitBtn").css("background-color", "white");
      $("#calcSubmitBtn").css("color", "#D40511");
      $("#serverCircle").addClass("green");
    }



  });
