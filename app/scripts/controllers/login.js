'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('LoginCtrl', ['$scope', '$stateParams', 'md5', 'Login', 'HongcaiLogin', function ($scope, $stateParams, md5, Login, HongcaiLogin) {
    // 获取用户的openId
    var openId = $stateParams.openId;
    console.log(openId);
    $scope.toLogin = function(user) {
      if (openId === undefined || openId === '' || openId === null) {
        HongcaiLogin.$create({account: user.account, password: md5.createHash(user.password)})
      } else {
        Login.$create({account: user.account, password: md5.createHash(user.password), openId: openId})
      }
    }
  }]);
