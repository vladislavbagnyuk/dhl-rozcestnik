$(document).ready(function() {
  // Hamburger menu animation
  var menuBtn = $('#mobileMenuBtn');
  var menu = $('#mainMenu');
  var langSwitch = $('#languageSwitch');
  var langBtn = $('#languageTogglerBtn');


  menuBtn.click(function(){

    if (langBtn.hasClass('is-active')) {
      langBtn.removeClass('is-active');
      langSwitch.css('left', '100vw');
    }

    if (menuBtn.hasClass('is-active')) {
      menuBtn.removeClass('is-active');
      menu.css('left', '100vw');
    } else {
      menuBtn.addClass('is-active');
      menu.css('left', '0');
    }
  });

  // Mobile language switch

  langBtn.click(function(){

    if (menuBtn.hasClass('is-active')) {
      menuBtn.removeClass('is-active');
      menu.css('left', '100vw');
    }

    if (langBtn.hasClass('is-active')) {
      langBtn.removeClass('is-active');
      langSwitch.css('left', '100vw');
    } else {
      langBtn.addClass('is-active');
      langSwitch.css('left', '0');
    }
  });
});
