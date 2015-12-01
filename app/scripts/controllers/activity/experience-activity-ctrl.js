'use strict';

angular.module('p2pSiteMobApp')
  .controller('ExperienceActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN) {
    
    $scope.channel = $stateParams.c; // 推广渠道
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
      restmod.model(DEFAULT_DOMAIN + '/users/simpleRegister').$create({
        mobile: user.mobile,
        captcha: user.captcha,
        channelCode: $scope.channel,
        openId: $rootScope.openid,
        nickName: $rootScope.nickName,
        headImgUrl: $rootScope.headImgUrl
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
        } else {
          $rootScope.user = response;
        }
      });
    };



  });
