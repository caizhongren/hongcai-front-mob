'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'md5', 'register', 'wechat', 'mobileCaptcha', function($rootScope, $scope, $state, $stateParams, md5, register, wechat, mobileCaptcha) {
    // 注册链接上是否有邀请码
    if ($stateParams.inviteCode) {
      $scope.user = {
        inviteCode: $stateParams.inviteCode
      };
    }

    var openId = $stateParams.openId;
    var signUpBe;
    if (openId === undefined || openId === '' || openId === null) {
      // 直接走注册流程
      signUpBe = register;
    } else {
      // wechat路线
      signUpBe = wechat.signUp;
    }
    $scope.signUp = function(user) {
      signUpBe.$create({
        name: user.name,
        password: md5.createHash(user.password),
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: user.inviteCode,
        openId: openId
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
        } else {
          $rootScope.user = {
            id: response.id
          };
          $state.go('root.register-success', {
            userId: $rootScope.user.id
          });
        }
      });
    };

    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      mobileCaptcha.$create({
        mobile: user.mobile
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
        }
      });
    };

  }]);
