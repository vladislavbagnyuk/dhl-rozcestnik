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
  // Change colors of labels for disabled inputs
  $('select:disabled').each(function() {
    $this = $(this);
    $label = $('label[for="'+ $this.attr('id') +'"]');
    if ($label.length > 0 ) {
      $label.addClass('disabledLabel');
    }
  });
  $('#form-new-1 select').change(function(){
    if( $(this).val() ) {
      $next = $(this).parent().next().children('select');
      $next.removeAttr("disabled");
      $label = $('label[for="'+ $next.attr('id') +'"]');
      if ($label.length > 0 ) {
        $label.removeClass('disabledLabel');
      }
    }
  });
});
