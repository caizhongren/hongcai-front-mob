'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterCtrl', ['$scope', 'md5', 'register', 'mobileCaptcha', function ($scope, md5, register, mobileCaptcha) {
    // 登录POST
    $scope.signUp = function(user) {

    };
    // 判断用户手机验证码
    $scope.sendMobileCaptcha = function(user) {
      //
      mobileCaptcha.$create({captcha: user.captcha})
    };
  }]);
