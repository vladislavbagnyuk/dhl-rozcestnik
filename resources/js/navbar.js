$(document).ready(function() {
  // Hamburger menu animation
  var menuBtn = $('#mobileMenuBtn');
  menuBtn.click(function(){
    if (menuBtn.hasClass('is-active')) {
      menuBtn.removeClass('is-active');
    } else {
      menuBtn.addClass('is-active');
    }
  });
});
