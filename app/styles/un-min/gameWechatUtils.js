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
  function removeParam (key, sourceURL){
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
    
  }
  function getQueryString(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  
    if (r != null) return unescape(r[2]); return null;  
  }
  function setCookie(c_name,value,expiredays) {
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
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

  //更新游戏剩余次数
  function updateCount () {
    $.ajax({
      url: '/hongcai/rest/activity/countingKings/userCountingInfo',
      type: 'PUT',
      success: function (res) {
        console.log(res)
        if (res && res.ret !== -1) {
          console.log('分享成功游戏次数减少')
        } else {
          alert(res.msg)
        }
      },
      data: 'openid=' + getCookie('openid') + '&type=2'
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
        if (location.pathname === '/views/games/game-counting-share.html') {
          window.location.href = location.origin + '/views/games/game-counting-start.html'
        } else {
          location.reload()
        }
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
        if (location.pathname === '/views/games/game-counting-share.html') {
          window.location.href = location.origin + '/views/games/game-counting-start.html'
        } else {
          location.reload()
        }
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
        if (location.pathname === '/views/games/game-counting-share.html') {
          window.location.href = location.origin + '/views/games/game-counting-start.html'
        } else {
          location.reload()
        }
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
        if (location.pathname === '/views/games/game-counting-share.html') {
          window.location.href = location.origin + '/views/games/game-counting-start.html'
        } else {
          location.reload()
        }
      },
      cancel: function (res) {
      },
      fail: function (res) {
        console.log('onMenuShareQZone: fail')
      }
    });
  }
  /**
   * 跳转去微信授权
   */
  function redirectToWechatAuth (redirect_uri){
    var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + 'wx02dfe579709d2d95' +
              "&redirect_uri=" + encodeURIComponent(removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
    alert(redirect_uri)
    alert(wechatRedirectUrl)
    window.location.href = wechatRedirectUrl
  }
  /**
   * 统一授权分享判断
   */
  // var openid = getCookie('openid') || 'oBBBjs6uL13Z7E03h5E2hEOnM_l8'
  var openid = getCookie('openid') || ''

  var wechat_code = getQueryString('code')
  function getOpenid () {
    $.get('/hongcai/rest/users/' + wechat_code + '/openid', function (response, status) {
      if ((response && response.ret == -1)) { //微信授权登录失败
        alert('openid')
        redirectToWechatAuth(location.href)
        // redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname)
        return
      } else if (response){
        alert(response.openid)
        openid = getCookie('openid') || response.openid
        setCookie('openid', openid, 1)
        alert(getCookie('openid'))
      }
    })
  }
  function WechatAuth () {
    var shareItem = {
      title : '我正在疯狂数钱中…',
      subTitle : '论手速，你不一定能比过我！不信就来试试看！数出多少送多少！',
      linkUrl : 'http://m.test321.hongcai.com/views/games/game-counting-start.html',
      imageUrl : 'https://mmbiz.qpic.cn/mmbiz_png/8MZDOEkib8AlSSicY3du8iciaLhZly5kkUP3PSrln8puqracuY9T3W79wJW4kh1BFV59zgG2T5nm7qictF9IicvC4gyw/0?wx_fmt=png'
    }
    // setCookie('openid', 'oBBBjs6uL13Z7E03h5E2hEOnM_l8', {'expires': 0.1, 'domain': 'http://localhost:9000'})
    if (getQueryString('act')) {
      setCookie('act', getQueryString('act'), 1)
    }
    if (getQueryString('f')) {
      setCookie('f', getQueryString('f'), 1)
    }
    if (!isWeixin()) {
      redirectToWechatAuth(location.href)
      return;
    } else {
      configJsApi(location.href.split('#')[0])
      wx.error(function(res){
        console.log('wx.error' + res)
      })
      wx.ready(function(){
        console.log('wx.ready')
        onMenuShareAppMessage(shareItem.title, shareItem.subTitle, shareItem.linkUrl, shareItem.imageUrl)
      })

      if (wechat_code) {
        getOpenid()
      }
      if (!getCookie('openid')) {
        alert(getCookie('openid'))
        redirectToWechatAuth(location.href)
        // redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname)
        return
      }
    }  
  }
  window.addEventListener('load', function () {
    WechatAuth()
  })
}()