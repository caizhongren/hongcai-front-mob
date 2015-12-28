'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('LoginCtrl', function($scope, $state, $rootScope, $stateParams, $location, md5, ipCookie, wechat, HongcaiLogin) {
    // 如果已经登录，自动跳转到首页。
    // if ($rootScope.hasLoggedUser) {
    //   $state.go('root.main');
    // }
    // 获取用户的openId
    var openId = $stateParams.openId;
    var redirectUrl = $stateParams.redirectUrl;
    var loginBe;

    if (ipCookie('userName')) {
      $scope.user = [];
      $scope.user.account = ipCookie('userName');
    }

    if (openId === undefined || openId === '' || openId === null) {
      loginBe = HongcaiLogin.userLogin;
    } else {
      loginBe = wechat.login;
    }

    $scope.toLogin = function(user) {
      if ($scope.rememberUserName) {
        ipCookie('userName', user.account, {
          expires: 60
        });
      }
      loginBe.$create({
        account: user.account,
        password: md5.createHash(user.password),
        openId: openId
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
        } else {

          if(redirectUrl){
            $location.path(decodeURIComponent(redirectUrl));
          }

          $rootScope.isLogged = true;
          $rootScope.hasLoggedUser = response.user;
          $state.go('root.main');
        }
      });
    };
  });
