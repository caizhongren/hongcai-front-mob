'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('GetPwdCtrl', function($rootScope, $scope, $state, $stateParams, $location, md5, register, wechat, mobileCaptcha, HongcaiUser, restmod, DEFAULT_DOMAIN) {
    $rootScope.headerTitle = '找回密码';
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

    $scope.mobileNum = $stateParams.mobile;
    $scope.captchaNum = $stateParams.captcha;

    //获取验证码进行下一步
    $scope.newPwd = function(mobile, captcha) {
      if(!mobile || !captcha){
        return;
      }

      HongcaiUser.$find('/checkMobileCaptcha', {
        mobile: mobile,
        captcha: captcha
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.getCaptchaErr = response.msg;
        } else {
          $state.go('root.getPwd2', {
            mobile: mobile,
            captcha: captcha
          });
        }
      });
    };

    $scope.$watch('user.captcha', function(newVal, oldVal){
      $scope.getCaptchaErr = null;
    });

    //确认找回并修改密码
    $scope.changePwd = function(pwd1, pwd2) {
      if (!pwd1 || !pwd2) {
        return;
      }

      if (pwd1 !== pwd2) {
        $scope.changePasswordMsg = "两次密码输入不一致";
        return;
      }

      restmod.model(DEFAULT_DOMAIN + '/users/resetMobilePassword')
        .$create({
          mobile: $scope.mobileNum,
          captcha: $scope.captchaNum,
          password: md5.createHash(pwd2)
        }).$then(function(response) {
          if (response.ret === -1) {
            $scope.changePasswordMsg = response.msg;
          } else {
            $state.go('root.login');
          }
        });
    }


  });
