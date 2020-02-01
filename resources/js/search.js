$(document).ready(function() {
  $('.search input[type=text]').focus(function(){
    $('.autocomplete').show();
    $('.autocomplete').css('height', 'auto');
  });
  $('.search input[type=text]').blur(function(){
    $('.autocomplete').css('height', 0);
    $('.autocomplete').hide();
  });
});
