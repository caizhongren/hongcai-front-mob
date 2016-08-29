/*
 * @Author: fuqiang1
 * @Date:   2016-08-29 17:43:41
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-29 18:05:44
 */

'use strict';
angular.module('p2pSiteMobApp')
  .factory('CheckPicUtil', function($rootScope, DEFAULT_DOMAIN, $http) {
    return {
      checkePic: function(val, msg) {
        if (val !== undefined) {
          var valLgth = val.toString().length;
          if (valLgth >= 4) {
            $http({
              method: 'POST',
              url: DEFAULT_DOMAIN + '/captchas/checkPic?captcha=' + val
            }).success(function(data) {
              if (data == true) {} else {
                $rootScope.showMsg(msg);
              }
            }).error(function() {
              $rootScope.showMsg(msg);
            });
          }
          $rootScope.showMsg(msg);
        }
      }
    }
  })
