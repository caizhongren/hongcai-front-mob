'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('LoginCtrl', function($timeout, $scope, $state, $rootScope, $stateParams, $location, md5, ipCookie, HongcaiLogin) {
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

    $scope.toLogin = function(user) {
      if ($scope.rememberUserName) {
        ipCookie('userName', user.account, {
          expires: 60
        });
      }
      HongcaiLogin.userLogin.$create({
        account: user.account,
        password: md5.createHash(user.password),
        openId: openId
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
          $rootScope.showMsg($scope.msg);
        } else {

          if (redirectUrl) {
            $location.path(decodeURIComponent(redirectUrl));
            // console.log($location.path(decodeURIComponent(redirectUrl)));
            return;
          }

          $rootScope.isLogged = true;
          $rootScope.hasLoggedUser = response.user;
          $state.go('root.main');
        }
      });
    };

    //密码显示方式
    $scope.showEyes = true;
    $scope.selectEyes = function(){
      $scope.showEyes = !$scope.showEyes;
      if(!$scope.showEyes){
        angular.element('.input-pwd').prop("type","text");
      }else{
        angular.element('.input-pwd').prop("type","password");
      }
    }
  });
