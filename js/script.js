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

  // scroll programming
  var $code = $('code#code');
  var $text = hljs.highlightAuto($code.text()).value;
  var cursor = '<span id="cursor" />';
  $code.html(cursor);
  $(window).scroll(function () {
    $scroll = $(this).scrollTop();
    if ($scroll < 1500) {
      $code.html($text.substring(0, $scroll/2) + cursor);
    }
  });

  // menu link scroll
  var offsets = $('#navi_marker').attrList('data-'); // TMP
  $('a[href^=#]').click(function() {
    var href = $(this).attr("href");
    if(offsets[href]){
      $('html,body').animate({ scrollTop: offsets[href] }, 500);
      return false;
    }
  });
});
