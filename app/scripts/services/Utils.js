'use strict';
angular.module('p2pSiteMobApp')
  .factory('Utils', function() {
    return {

      /**
       * 计算每月应付金额
       */
      isWeixin: function(){
          var ua = navigator.userAgent.toLowerCase();
          if(ua.match(/MicroMessenger/i)=="micromessenger") {
              return true;
          } else {
              return false;
          }
      }
    };
  });
