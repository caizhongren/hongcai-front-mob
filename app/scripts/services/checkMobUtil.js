/*
 * @Author: Administrator
 * @Date:   2016-08-29 14:03:25
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-29 18:13:04
 */

'use strict';
angular.module('p2pSiteMobApp')
  .factory('CheckMobUtil', function($rootScope, Restangular) {
    return {
      checkMob: function(val) {
        $rootScope.mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[0678]))\d{8}$/;
        var msg = '';
        if (val !== undefined) {
          var valLgth = val.toString().length;
          if (valLgth > 11 && !$rootScope.mobilePattern.test(val)) {
            msg = '手机号码格式不正确';
            $rootScope.showMsg(msg);
            return msg;
          }
        }
      }
    }
  })
