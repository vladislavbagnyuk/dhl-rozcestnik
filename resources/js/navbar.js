$(document).ready(function() {
  // Hamburger menu animation
  var menuBtn = $('#mobileMenuBtn');
  var menu = $('#mainMenu');
  menuBtn.click(function(){
    if (menuBtn.hasClass('is-active')) {
      menuBtn.removeClass('is-active');
      menu.css('left', '100vw');
    } else {
      menuBtn.addClass('is-active');
      menu.css('left', '0');
    }
  });
});
