/*
 * @Author: Administrator
 * @Date:   2016-08-29 14:03:25
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-09-22 17:44:23
 */

'use strict';
angular.module('p2pSiteMobApp')
  .factory('CheckMobUtil', function($rootScope, Restangular, $location) {
      return {
        checkMob: function(val) {
          $rootScope.mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
          var msg = '';
          var path = $location.path().split('/')[1];
        if (val !== undefined) {
          var valLgth = val.toString().length;
          if (valLgth > 11 && !$rootScope.mobilePattern.test(val)) {
            msg = '手机号码格式不正确';
            $rootScope.showMsg(msg);
          }
          if (valLgth === 11 && $rootScope.mobilePattern.test(val)) {
            Restangular.one('/users/').post('isUnique', {
              account: val
            }).then(function(response) {
              if (path == 'getPwd1') {
                if (response.ret == -1) {
                  return;
                }
                msg = '该手机号还未注册';
                $rootScope.showMsg(msg);
              }
              if (path !== 'getPwd1') {
                if (response.ret === -1) {
                  msg = '手机号已被占用';
                  $rootScope.showMsg(msg);
                }
              }
            })
          }
        }
      }
    }
  })
