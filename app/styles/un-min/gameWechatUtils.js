(function(){
  // $.ajaxSetup({  
  //   async : false  
  // }); 

  var xmlhttp = "";
  var xmlGet = "";
  var xmlPut = "";
  function ajaxPOST(urlstr, responseFunc, datas) {
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST", urlstr, false);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(datas);
    xmlhttp.onreadystatechange = responseFunc;
  }
  function ajaxGet(urlstr, responseFunc) {
    if (window.XMLHttpRequest) {
        xmlGet = new XMLHttpRequest();
    } else {
        xmlGet = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlGet.open("GET", urlstr, false);
    xmlGet.send();
    xmlGet.onreadystatechange = responseFunc;
  }

  function ajaxPUT(urlstr, responseFunc, datas) {
    if (window.XMLHttpRequest) {
      xmlPut = new XMLHttpRequest();
    } else {
      xmlPut = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlPut.open("PUT", urlstr, false);
    xmlPut.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlPut.send(datas);
    xmlPut.onreadystatechange = responseFunc;
  }

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
   * 跳转去微信授权
   */
  function redirectToWechatAuth (redirect_uri){
    var wechatRedirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + 'wx02dfe579709d2d95' +
              "&redirect_uri=" + encodeURIComponent(removeParam('code', redirect_uri)) + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
    window.location.href = wechatRedirectUrl
  }
  /**
   * 统一授权分享判断
   */
  // var openid = getCookie('openid') || 'oBBBjs6uL13Z7E03h5E2hEOnM_l8'
  var openid = getCookie('openid') || ''

  var wechat_code = getQueryString('code')
  function getOpenid () {
    ajaxGet('/hongcai/rest/users/' + wechat_code + '/openid', function() {
      if (xmlGet.readyState == 4 && xmlGet.status == 200) {
        var response = JSON.parse(xmlGet.responseText);
        if ((response && response.ret == -1)) { //微信授权登录失败
          alert('openid')
          redirectToWechatAuth(location.href)
          // redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname)
          return
        } else if (response){
          openid = getCookie('openid') || response.openid || 'oBBBjs6uL13Z7E03h5E2hEOnM_l8'
          setCookie('openid', openid, 1)
        }
      }
    })
    // $.get('/hongcai/rest/users/' + wechat_code + '/openid', function (response, status) {
    //   if ((response && response.ret == -1)) { //微信授权登录失败
    //     alert('openid')
    //     // redirectToWechatAuth(location.href)
    //     redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname)
    //     return
    //   } else if (response){
    //     openid = getCookie('openid') || response.openid || 'oBBBjs6uL13Z7E03h5E2hEOnM_l8'
    //     setCookie('openid', openid, 1)
    //   }
    // })
  }
  function WechatAuth () {
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
      
      if (wechat_code) {
        getOpenid()
      }
      if (!getCookie('openid')) {
        redirectToWechatAuth(location.href)
        // redirectToWechatAuth('http://m.test321.hongcai.com' + location.pathname)
        return
      }
    }
  }
  // window.addEventListener('load', function () {
    WechatAuth()
  // })
})();