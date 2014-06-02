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
    if ($scroll < 4000) {
      $code.html($text.substring(0, Math.round($scroll/5)) + cursor);
    }
  });

  // menu link scroll
  var datas = document.getElementById('navi_marker').dataset;
  var i = 0, j = 0;
  var menu = ['about', 'skills', 'works', 'contact'];
  var set = function(to, offset){
    $('a[href^=#' + to + ']').click(function() {
      $('html,body').animate({ scrollTop: offset }, 1000);
      return false;
    });
  }
  set('home', 0);
  for(key in datas){
    if(i++%2) set(menu[j++], key);
  }
});
