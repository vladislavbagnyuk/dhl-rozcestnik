$(document).ready(function() {
  //$defaultRowWidth = $(".similar-posts").width();
  $defaultRowWidth = 880;
  console.log($defaultRowWidth);
  $(".similar-posts").width($defaultRowWidth * 3 - 11);
  $(".similar-posts").css("left", $defaultRowWidth * -1 + "px");
  $("#similarRight").click(function(){
    $left = parseInt($(".similar-posts").css("left")) - $defaultRowWidth;
    console.log($left);
    if (left >= 1760) {
      $(".similar-posts").animate({
        left: $left
      });  
    }
  });
  $("#similarLeft").click(function(){
    $left = parseInt($(".similar-posts").css("left")) + $defaultRowWidth;
    console.log($left);
    if ($left <= 0) {
      $(".similar-posts").animate({
        left: $left
      });
    }
  });
});
