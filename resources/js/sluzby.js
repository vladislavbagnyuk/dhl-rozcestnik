$(document).ready(function() {
  $("#sluzbyMobileToggler").click(function(){
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
});
