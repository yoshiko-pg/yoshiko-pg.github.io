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
  var $lineNum = $('#line-num');
  var $colNum = $('#col-num');
  var commentLineNum = $('code#comment').text().match(/\n/g).length + 3;
  var codeText = hljs.highlightAuto($code.text()).value;
  var cursor = '<span id="cursor">';
  $code.html(cursor);
  $(window).scroll(function () {
    $scroll = $(this).scrollTop();
    if ($scroll < 4000) {
      $code.html(codeText.substring(0, Math.round($scroll/6)) + cursor);
      var currentCode = $code.text();
      var lines = currentCode.match(/\n/g);
      $lineNum.text(commentLineNum + (lines ? lines.length : 0));
      var colText = currentCode.match(/(?:^|\n)(.*?)$/)[1];
      $colNum.text(colText ? colText.length : 0);
    }
  });

  // menu link scroll
  var datas = document.getElementById('navi_marker').dataset;
  var i = 0, j = 0;
  var menu = ['about', 'skills', 'works', 'contact'];
  var offsets = [];
  var set = function(to, offset){
    $('a[href^=#' + to + ']').click(function() {
      $('html,body').animate({ scrollTop: offset }, 1000);
      return false;
    });
  }
  set('home', 0);
  for(key in datas){
    if(i++%2){
      set(menu[j++], key);
      offsets.push(key);
    }
  }

  // ハッシュで直リンク
  if(location.hash){
    var key = menu.indexOf(location.hash.replace('#', ''));
    $('html,body').animate({ scrollTop: offsets[key] }, 1000);
  }

  // worksリンク反応しない問題回避
  $('#work_list li').on('click', function(){
    window.open($(this).find('a').attr('href'));
  });
});
