$(document).ready(function() {

  var input = $('.search input[type=text]');

  input.click(function(){
    $('.autocomplete').show();
    $('.autocomplete').css('height', 'auto');
  });

$('.autocomplete ul li').click(function(){
  var text = $(this).contents().get(0).nodeValue;
  input.val(text);
  $('.autocomplete').css('height', 0);
  $('.autocomplete').hide();
});

$(document).on("click", function(event){
  if(!$(event.target).closest(".search input[type=text]").length){
    if(!$(event.target).closest(".autocomplete").length){
      // Showing the hint message
      $('.autocomplete').css('height', 0);
      $('.autocomplete').hide();
    }
  }
});

});
