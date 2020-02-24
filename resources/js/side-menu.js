$(document).ready(function() {
  $(".side-menu li span").click(function(){
    $this = $(this);
    $(".side-menu li span").each(function(){
      $span = $(this);
      if ($span != $this) {
        if ($span.hasClass("active")) {
          $span.removeClass("active");
          $span.children("img").attr("src", "resources/img/icons/arrow-down.svg");
          $span.next("ul").animate({
            height: 0
          }, 300, $.bez([0.22, 0.61, 0.35, 1]) );
        }
      }
    });
    $submenu = $this.next("ul");
    if ($submenu.height() == 0) {
      $this.addClass("active");
      $this.children("img").attr("src", "resources/img/icons/arrow-up.svg");
      $submenu.animate({
        height: $submenu.get(0).scrollHeight
      }, 300, $.bez([0.22, 0.61, 0.35, 1]) );
    } else {
      $this.removeClass("active");
      $this.children("img").attr("src", "resources/img/icons/arrow-down.svg");
      $submenu.animate({
        height: 0
      }, 300, $.bez([0.22, 0.61, 0.35, 1]) );
    }
  });
});
