'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterCtrl', ['$scope', '$stateParams', 'md5', 'register', 'mobileCaptcha', function ($scope, $stateParams, md5, register, mobileCaptcha) {
    // 注册链接上是否有邀请码
    if ($stateParams.inviteCode) {
      $scope.user = {
        inviteCode: $stateParams.inviteCode
      };
    }
    // 注册POST
    $scope.signUp = function(user) {
      console.log(121);
      register.$create({name: user.name, password: md5.createHash(user.password), mobile: user.mobile, captcha: user.captcha, inviteCode: user.inviteCode}).$then(function(response){
        if (response.ret === -1) {
        }
      });
    };
    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      console.log(user.mobile);
      mobileCaptcha.$create({mobile: user.mobile}).$then(function(response){
        if (response.ret === -1) {
          $scope.msg = response.msg;
          console.log($scope.msg);
        }
      });;
    };
  }]);
