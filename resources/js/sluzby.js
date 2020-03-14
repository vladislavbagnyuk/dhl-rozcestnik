$(document).ready(function() {
  $("#sluzbyMobileToggler").click(function(){
    $hide = $(this).parent().children(".sluzby-hide");
    if ($hide.height() != 0) {
      $hide.animate({
        height: 0
      }, 300, $.bez([0.22, 0.61, 0.35, 1]) );
    } else {
      $hide.animate({
        height: 0
      }, 300, $.bez([0.22, 0.61, 0.35, 1]) );
    }
  });
});
