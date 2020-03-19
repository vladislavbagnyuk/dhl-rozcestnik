$(document).ready(function() {
  // Enable popovers
  $(function () {
    $('[data-toggle="popover"]').popover()
  })

  // Show whole card
  $(".sluzbyMobileToggler").click(function(){
    $hide = $(this).parent().children(".sluzby-hide");
    if ($hide.height() != 0) {
      $hide.animate({
        height: 0
      }, 400, $.bez([0.55, 0.05, 0.68, 1]) );
      $(".last-border").css("border-bottom", "none");
      $(this).html('Zobrazit více<img src="resources/img/icons/arrow-down-red.svg" alt="">')
    } else {
      $hide.animate({
        height: $hide.get(0).scrollHeight
      }, 400, $.bez([0.22, 0.61, 0.35, 1]) );
      $(".last-border").css("border-bottom", "1px solid black");
      $(this).html('Zobrazit méně<img src="resources/img/icons/arrow-up-red.svg" alt="">');
    }
  });

  // Close card
  $(".table-close").click(function(){
    if ($(window).width() <= 768) {
      $(this).parent().parent().parent().animate({
        height: 0
      }, {
        queue: false,
        duration: 400,
        easing: $.bez([0.55, 0.05, 0.68, 1]),
        complete: function() {
            $(this).hide();
        }});
    } else {
      $(this).parent().parent().parent().hide();
      $("#view-all-desktop").removeAttr("disabled");
    }

  });

  // Show all cards
  $("#view-all-desktop").click(function(){
      $(".sluzby-table-row .col-12").show();
      $(this).prop("disabled", "true");
  });

  // Scroll bar on top and bottom
  $(".row-container").doubleScroll();

  // Next columns
  $("#btn-sluzby-right").click(function(){
    $scroll = $(".row-container").scrollLeft() + 375;
    $(".row-container").animate({
      scrollLeft: $scroll
    }, {
      queue: false,
      duration: 400,
      easing: $.bez([0.55, 0.05, 0.68, 1]),
      });
      $("#btn-sluzby-left").show();
  });

  // Previous columns
  $("#btn-sluzby-left").click(function(){
    $scroll = $(".row-container").scrollLeft() - 375;
    $(".row-container").animate({
      scrollLeft: $scroll
    }, {
      queue: false,
      duration: 400,
      easing: $.bez([0.55, 0.05, 0.68, 1]),
    });
    if ($scroll <= 0) {
      $("#btn-sluzby-left").hide();
    }
  });

  $(".row-container").scroll(function(){
    if ($(".row-container").scrollLeft() <= 0) {
      $("#btn-sluzby-left").hide();
    } else {
      $("#btn-sluzby-left").show();
    }
  });
});
