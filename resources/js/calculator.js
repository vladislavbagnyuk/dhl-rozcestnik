$(document).ready(function() {
  $("#calculator-form").submit(function(e) {
    e.preventDefault();
    before();
    calculation(after, validationSuccess);
  });

  function before() {
    $(".server-wait").show();
    $("#calcSubmitBtn").attr("disabled", "disabled");
  }

  function after() {
    $(".server-wait").hide();
    $("#calcSubmitBtn").removeAttr("disabled");
  }

  function validationSuccess() {
    $("#calcSubmitBtn").html("Přepočítat");
    $("#calcSubmitBtn").css("background-color", "white");
    $("#calcSubmitBtn").css("color", "#D40511");
    $("#serverCircle").addClass("green");
    $("#phoneLink").removeClass("disabled");
    $("#emailLink").removeClass("disabled");
    $(".delimeter-container").removeClass("disabled");
    $("#calcSubmitBtn").attr("disabled", "disabled");
    if ($(window).width() < 768) {
      $("html, body").animate(
        {
          scrollTop: $("#result").offset().top - 70
        },
        550,
        $.bez([0.22, 0.61, 0.35, 1])
      );
    }
  }
});
