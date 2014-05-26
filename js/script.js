$(function(){
  $('#close').click(function(){
    if(window.confirm('保存されていません！閉じてもよろしいですか？')){
      var nvua = navigator.userAgent;
      if(nvua.indexOf('MSIE') >= 0){
        if(nvua.indexOf('MSIE 5.0') == -1) {
          top.opener = '';
        }
      }else if(nvua.indexOf('Gecko') >= 0){
        top.name = 'CLOSE_WINDOW';
        wid = window.open('','CLOSE_WINDOW');
      }
      top.close();
    }
  });

  var $code = $('code#code');
  var $text = hljs.highlightAuto($code.text()).value;
  $(window).scroll(function () {
    $scroll = $(this).scrollTop();
    if ($scroll < 1500) {
      $code.html($text.substring(0, $scroll/2) + "<span id='cursor' />");
    }
  });
})
