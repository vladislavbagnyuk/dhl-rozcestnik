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

  // Banner
  var banner = $('#banner');
  banner.css('height', banner.height() + 'px');

  $('#bannerCloseBtn').click(function(){
    banner.css('height', 0);
  });
  $('#bannerOkBtn').click(function(){
    banner.css('height', 0);
  });

  // Desktop menu after scroll
  $(document).scroll(function(){
    if( $(window).width() >= 768 ) {
      scrolled = $(document).scrollTop();
      offset = $('#mainNavbar').offset().top + $('#mainNavbar').outerHeight();
      if (scrolled >= offset) {
        $('.navbar-scroll').css('height', '54px');
      } else {
        $('.navbar-scroll').css('height', '0');
      }
    }
  });

});
