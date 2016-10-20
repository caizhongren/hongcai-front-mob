'use strict';

angular.module('p2pSiteMobApp')
  .controller('ExperienceActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, mobileCaptcha, ipCookie, Utils) {
    
    $scope.channelCode = $stateParams.f; // 推广渠道
    $scope.number = $stateParams.number;
    $scope.imgSrc = "/images/activity/activity0071.png";

    if ($scope.number === "1") {
      $scope.imgSrc = "/images/activity/activity0071.png";
      $scope.money = "2000";
    } else if ($scope.number === "2") {
      $scope.imgSrc = "/images/activity/activity0072.png";
      $scope.money = "4000";
    }

    $scope.register = function(user) {
      if(!user || !user.mobile || !user.captcha){
        return;
      }
      Restangular.one('users').post('simRegister', {
        mobile: user.mobile,
        captcha: user.captcha,
        channelCode: $scope.channelCode,
        openId: $rootScope.openid,
        nickName: $rootScope.nickName,
        headImgUrl: $rootScope.headImgUrl,
        guestId: ipCookie('guestId'),
        device: Utils.deviceCode()
      }).then(function(response){
        if (response.ret === -1) {
          $scope.msg = response.msg;
          alert(response.msg);
        } else {
          alert('领取成功！');
          $state.go('root.userCenter.account');
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
