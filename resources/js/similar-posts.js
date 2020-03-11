function similarPosts() {
  if ($(window).width() >= 1024) {
    $defaultRowWidth = 880;
    $(".similar-posts").width($defaultRowWidth * 3 - 11);
    $(".similar-posts").css("left", $defaultRowWidth * -1 + "px");
    $("#similarRight").click(function(){
      $left = parseInt($(".similar-posts").css("left")) - $defaultRowWidth;
      if ($left >= -1760) {
        $(".similar-posts").animate({
          left: $left
        }, 400, $.bez([0.22, 0.61, 0.35, 1]) );
      }
    });
    $("#similarLeft").click(function(){
      $left = parseInt($(".similar-posts").css("left")) + $defaultRowWidth;
      if ($left <= 0) {
        $(".similar-posts").animate({
          left: $left
        }, 400, $.bez([0.22, 0.61, 0.35, 1]) );
      }
    });
  } else {
    $(".similar-posts").css("width", "auto");
    $(".similar-posts").css("left", 0);
  }
}
$(document).ready(function() {
  similarPosts();
  $(window).resize(function(){
    similarPosts();
  })
});
