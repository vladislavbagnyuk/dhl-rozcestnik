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
      //$label.css('top', '11px');
      $label.css('font-size', '16px');
    } else {
      $label.css('top', '1px');
      $label.css('font-size', '11px');
    }
  });


  function enableSelect($this) {
    $this.removeAttr("disabled");
    $label = $('label[for="'+ $this.attr('id') +'"]');
    if ($label.length > 0 ) {
      $label.removeClass('disabledLabel');
    }
  }
  function disableSelect($this) {
    $this.attr('disabled', 'disabled');
    $label = $('label[for="'+ $this.attr('id') +'"]');
    if ($label.length > 0 ) {
      $label.addClass('disabledLabel');
      $label.css('font-size', '16px');
    }
  }
  // Change colors of labels for disabled inputs
  $('select:disabled').each(function() {
    disableSelect($(this));
  });
  $('#form-new-1 select').change(function(){
    if( $(this).val() ) {
      $next = $(this).parent().next().children('select');
      enableSelect($next);
    } else {
      $nextParent = $(this).parent().nextUntil("button");
      $nextParent.each(function(){
        $next = $(this).children("select");
        $next.prop('selectedIndex',0);
        disableSelect($next);
      });
    }
  });
});
