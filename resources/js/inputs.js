$(document).ready(function() {

/*
  $('input').each(function(){
    var $element = $(this)

    if ($element.val() == '') {
      var $label = $("label[for='"+this.id+"']")
      alert($label.text())
    }

  });
*/


  $('input').focus(function(){
    var $element = $(this);
    var $label = $("label[for='"+this.id+"']");
    $label.css('font-size', '11px');
  });

  $("input").blur(function(){
    var $element = $(this);
    if( !$element.val() ) {
      var $label = $("label[for='"+this.id+"']");
      $label.css('font-size', '16px');
    }
  });


});
