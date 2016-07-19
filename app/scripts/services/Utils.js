'use strict';
angular.module('p2pSiteMobApp')
  .factory('Utils', function($rootScope) {
    return {

      /**
       * 计算每月应付金额
       */
      isWeixin: function(){
          var ua = navigator.userAgent.toLowerCase();
          return ua.match(/MicroMessenger/i)=="micromessenger";
      },

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
      }

    };
  });
