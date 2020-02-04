$(document).ready(function() {

  $('input').focus(function(){
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
  $("select").change(function(){
    var $label = $("label[for='"+this.id+"']");
    if( !$(this).val() ) {
      $label.css('top', '11px');
      $label.css('font-size', '16px');
    } else {
      $label.css('top', '1px');
      $label.css('font-size', '11px');
    }
  });

});
