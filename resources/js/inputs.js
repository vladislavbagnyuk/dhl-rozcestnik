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


  $('input').click(function(){
    var $element = $(this);
    var $label = $("label[for='"+this.id+"']");
    //alert($label.text());
    $label.css('font-size', '11px');
  });
});
