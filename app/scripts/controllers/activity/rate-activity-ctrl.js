'use strict';

angular.module('p2pSiteMobApp')
  .controller('RateActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, mobileCaptcha, ipCookie, Utils) {

    $scope.register = function(user) {
      if(!user || !user.mobile || !user.captcha){
        return;
      }
      Restangular.one('users').post('simRegister', {
        mobile: user.mobile,
        captcha: user.captcha,
        channelCode: $rootScope.channelCode,
        openId: $rootScope.openid,
        nickName: $rootScope.nickName,
        headImgUrl: $rootScope.headImgUrl,
        device: Utils.deviceCode()
      }).then(function(response){
        if (response.ret === -1) {
          $scope.msg = response.msg;
          alert(response.msg);
        } else {
          $rootScope.user = response;
        }
      });
      
    };


    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      if(!user.mobile){
        $scope.msg="请输入手机号码";
        return;
      }

      mobileCaptcha.$create({
        mobile: user.mobile,
        guestId: ipCookie('guestId'),
        device: Utils.deviceCode()
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
          alert(response.msg);
        }
      });
    };


  });
