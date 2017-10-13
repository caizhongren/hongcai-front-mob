window.onload = function(){
  $.ajaxSetup({  
    async : false  
  }); 
  /**
   * 是否在微信中
   */
  function isWeixin(){
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i)=="micromessenger"
  }
  function getCookie(c_name) {  
    if (document.cookie.length > 0) {  
      c_start = document.cookie.indexOf(c_name + "=");  
      if (c_start != -1) {  
        c_start = c_start + c_name.length + 1;  
        c_end = document.cookie.indexOf(";", c_start);  
        if (c_end == -1)  
          c_end = document.cookie.length;  
        return unescape(document.cookie.substring(c_start, c_end));  
      }  
    }  
    return "";  
  }
  var gameCounts = 0
  //更新游戏剩余次数
  function updateCount () {

    // ajaxPOST('/hongcai/rest/activity/countingKings/userCountingInfo', function() {
    //   if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    //     var res = JSON.parse(xmlhttp.responseText);
    //     if (res && res.ret !== -1) {
    //       gameCounts = res.count
    //       console.log('分享成功游戏次数增加')
    //       shareSuccess()
    //     } else {
    //       alert(res.msg)
    //     }
    //   }
    // }, 'openid=' + getCookie('openid') + '&type=2')


    $.ajax({
      url: '/hongcai/rest/activity/countingKings/userCountingInfo',
      type: 'PUT',
      success: function (res) {
        console.log(res)
        if (res && res.ret !== -1) {
          gameCounts = res.count
          console.log('分享成功游戏次数增加')
          shareSuccess()
        } else {
          alert(res.msg)
        }
      },
      data: 'openid=' + getCookie('openid') + '&type=2'
    })
  }
  // 统一分享成功页面跳转
  function shareSuccess () {
    if (location.pathname === '/views/games/game-counting-share.html') {
      window.location.href = location.origin + '/views/games/game-counting-start.html'
    } else if (location.pathname === '/views/games/game-counting.html') {
      document.getElementById('gameCounts').innerHTML = gameCounts
    } else {
      location.reload()
    }
  }
  /**
   * 调用微信接口，申请此页的分享接口调用
   * @param
   * @return
   */
  function configJsApi (url){
    url = encodeURIComponent(url);
    $.get('/hongcai/rest/wechat/jsApiConfig?requestUrl=' + url, function (apiConfig, status) {
      if (apiConfig && apiConfig.ret !== -1) {
        wx.config({
          debug: false,
          appId: apiConfig.appId, // 必填，公众号的唯一标识
          timestamp: apiConfig.timestamp, // 必填，生成签名的时间戳
          nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
          signature: apiConfig.signature,// 必填，签名，见附录1
          jsApiList:
              [
              'onMenuShareAppMessage',
              'hideMenuItems',
              'onMenuShareTimeline', 
              'onMenuShareQQ', 
              'onMenuShareQZone'
              ]
        })
      } else {
        console.log('apiConfig' + apiConfig.msg)
      }
    })
  }
  /**
   * 设置用户分享的标题以及描述以及图片等。
   */
  function onMenuShareAppMessage (title, subTitle, shareLink, imgUrl){
    // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
    wx.onMenuShareAppMessage({
      title: title,
      desc: subTitle,
      link: shareLink,
      imgUrl: imgUrl,
      trigger: function (res) {
      },
      success: function (res) {
        // 分享成功后隐藏分享引导窗口
        console.log('onMenuShareAppMessage: success')
        updateCount()
      },
      cancel: function (res) {
      },
      fail: function (res) {
        console.log('onMenuShareAppMessage: fail')
      }
    });
    // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
    wx.onMenuShareTimeline({
      title: title,
      link: shareLink,
      imgUrl: imgUrl,
      trigger: function (res) {
      },
      success: function (res) {
        // 分享成功后隐藏分享引导窗口
        console.log('onMenuShareTimeline: success')
        updateCount()
      },
      cancel: function (res) {
      },
      fail: function (res) {
        console.log('onMenuShareTimeline: fail')
      }
    });
    // 获取“分享到QQ”按钮点击状态及自定义分享内容接口
    wx.onMenuShareQQ({
      title: title,
      desc: subTitle,
      link: shareLink,
      imgUrl: imgUrl,
      trigger: function (res) {
      },
      success: function (res) {
        // 分享成功后隐藏分享引导窗口
        console.log('onMenuShareQQ: success')
        updateCount()
      },
      cancel: function (res) {
      },
      fail: function (res) {
        console.log('onMenuShareQQ: fail')
      }
    });
    // 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
    wx.onMenuShareQZone({
      title: title,
      desc: subTitle,
      link: shareLink,
      imgUrl: imgUrl,
      trigger: function (res) {
      },
      success: function (res) {
        // 分享成功后隐藏分享引导窗口
        console.log('onMenuShareQZone: success')
        updateCount()
      },
      cancel: function (res) {
      },
      fail: function (res) {
        console.log('onMenuShareQZone: fail')
      }
    });
  }
  function wxConfig() {
    if (isWeixin()) {
      var shareItem = {
        title : '我正在疯狂数钱中…',
        subTitle : '论手速，你不一定能比过我！不信就来试试看！数出多少送多少！',
        linkUrl : 'http://m.test321.hongcai.com/views/games/game-counting-start.html',
        imageUrl : 'https://mmbiz.qpic.cn/mmbiz_png/8MZDOEkib8AlSSicY3du8iciaLhZly5kkUP3PSrln8puqracuY9T3W79wJW4kh1BFV59zgG2T5nm7qictF9IicvC4gyw/0?wx_fmt=png'
      }

      configJsApi(location.href.split('#')[0])
      wx.error(function(res){
        console.log('wx.error' + res)
      })
      wx.ready(function(){
        console.log('wx.ready')
        onMenuShareAppMessage(shareItem.title, shareItem.subTitle, shareItem.linkUrl, shareItem.imageUrl)
      })
    }
  }
  window.addEventListener('load', function () {
    wxConfig()
  })
}()
