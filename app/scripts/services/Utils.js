'use strict';
angular.module('p2pSiteMobApp')
  .factory('Utils', function($rootScope) {
    return {

      /**
       * 是否在微信中
       */
      isWeixin: function(){
          var ua = navigator.userAgent.toLowerCase();
          return ua.match(/MicroMessenger/i)=="micromessenger";
      },

      /**
       * 设置微信等webview中的title
       */
      setTitle: function(title){
        // 微信等webview中无法修改title的问题
        //需要jQuery
        var $body = $('body');
        document.title = title;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src="/favicon.ico" style="visibility:hidden"></iframe>');
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);
      },


      /**
       * 判断浏览器手机版本
       */
      browser: function(){

        return {

          // Windows Phone's UA also contains "Android"
          isAndroid : function(){
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /android/i.test(userAgent) && !/windows phone/i.test(userAgent);
          },

          // iOS detection from: http://stackoverflow.com/a/9039885/177710
          isIos : function(){
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;
            return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
          },

          isWinPhone: function(){
            return /windows phone/i.test(userAgent);
          }
        }

      },

      /**
       * 获取和后端对应的deviceCode
       */
      deviceCode: function () {

        var deviceCode = 0;

        if(this.browser().isAndroid()){
          deviceCode = 2;
        }

        if(this.isWeixin() && this.browser().isAndroid()){
          deviceCode = 3;
        }

        if(this.browser().isIos()){
          deviceCode = 5;
        }

        if(this.isWeixin() && this.browser().isIos()){
          deviceCode = 6;
        }

        return deviceCode;
      },

      /**
       * 页面body上创建一个form
       */
      createForm: function() {
        var f = document.createElement('form');
        document.body.appendChild(f);
        f.method = 'post';
        // f.target = '_blank';
        return f;
      },

      /**
       * 增加表单提交元素
       */
      createElements: function (eForm, eName, eValue) {
        var e = document.createElement('input');
        eForm.appendChild(e);
        e.type = 'text';
        e.name = eName;
        if (!document.all) {
          e.style.display = 'none';
        } else {
          e.style.display = 'block';
          e.style.width = '0px';
          e.style.height = '0px';
        }
        e.value = eValue;
        return e;
      }

    };
  });
