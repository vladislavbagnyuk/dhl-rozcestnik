$(document).ready(function() {
  var input = $('.search input[type=text]');
  var dropdown = $('.autocomplete');
  input.click(function(){
    dropdown.show();
    input.addClass("search-focused");
    dropdown.css('height', 'auto');
  });

$('.autocomplete ul li').click(function(){
  var text = $(this).contents().get(0).nodeValue;
  input.val(text);
  input.removeClass("search-focused");
  dropdown.css('height', 0);
  dropdown.hide();
});

$(document).on("click", function(event){
  if(!$(event.target).closest(".search input[type=text]").length){
    if(!$(event.target).closest(".autocomplete").length){
      input.removeClass("search-focused");
      dropdown.css('height', 0);
      dropdown.hide();
    }
  }
});

});
