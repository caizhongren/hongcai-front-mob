'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('LoginCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'md5', 'ipCookie', 'Login', 'HongcaiLogin', function ($scope, $state, $rootScope, $stateParams, md5, ipCookie, Login, HongcaiLogin) {
    // 获取用户的openId
    var openId = $stateParams.openId;

    if (ipCookie('userName')) {
      $scope.user = [];
      $scope.user.account = ipCookie('userName');
    }

    $scope.toLogin = function(user) {
      if ($scope.rememberUserName) {
        ipCookie('userName', user.account, {
          expires: 60
        });
      }
      if (openId === undefined || openId === '' || openId === null) {
        HongcaiLogin.userLogin.$create({account: user.account, password: md5.createHash(user.password)}).$then(function(response){
          if (response.ret === -1) {
            $scope.msg = response.msg;
          } else {
            $rootScope.isLogged = true;
            $rootScope.hasLoggedUser = response;
            $state.go('root.main');
          }
        });
      } else {
        Login.$create({account: user.account, password: md5.createHash(user.password), openId: openId}).$then(function(response){
          if (response.ret === -1) {
            $scope.msg = response.msg;
          }
        });
      }
    };
  }]);
