/*
 * @Author: fuqiang1
 * @Date:   2016-08-29 17:43:41
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-30 09:01:28
 */

'use strict';
angular.module('p2pSiteMobApp')
  .factory('CheckPicUtil', function($rootScope, DEFAULT_DOMAIN, $http) {
    return {
      checkePic: function(val) {
        if (val !== undefined) {
          var msg = '';
          var valLgth = val.toString().length;
          if (valLgth >= 4) {
            $http({
              method: 'POST',
              url: DEFAULT_DOMAIN + '/captchas/checkPic?captcha=' + val
            }).success(function(data) {
              if (data == true) {} else {
                msg = '图形验证码错误';
                $rootScope.showMsg(msg);
              }
            }).error(function() {
              msg = '图形验证码错误';
              $rootScope.showMsg(msg);
            });
          }
        }
      }
    }
  })
