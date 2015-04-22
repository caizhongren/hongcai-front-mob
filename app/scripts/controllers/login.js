'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('LoginCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'md5', 'Login', 'HongcaiLogin', function ($scope, $state, $rootScope, $stateParams, md5, Login, HongcaiLogin) {
    // 获取用户的openId
    var openId = $stateParams.openId;
    $scope.toLogin = function(user) {
      if (openId === undefined || openId === '' || openId === null) {
        HongcaiLogin.userLogin.$create({account: user.account, password: md5.createHash(user.password)}).$then(function(response){
          if (response.ret === -1) {
            $scope.msg = response.msg;
          } else {
            $rootScope.login = true;
            $rootScope.user = {
              id : response.id
            };
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
