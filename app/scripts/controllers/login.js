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
    $scope.busy = false;
    $scope.toLogin = function(user) {
      
      user.password = user.password.replace(/\s/g, "");
      
      if($scope.busy){
        return;
      }

      if(!user.password || !user.account){
        $rootScope.showMsg('账号或密码不能为空');
        return;
      }

      if ($scope.rememberUserName) {
        ipCookie('userName', user.account, {
          expires: 60
        });
      }
      $scope.busy = true;
      HongcaiLogin.userLogin.$create({
        account: user.account,
        password: md5.createHash(user.password),
        openId: openId,
        guestId: ipCookie('guestId')
      }).$then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
          $timeout(function() {
            $scope.busy = false;
          }, 1000);
        } else {
          $timeout(function() {
            $scope.busy = false;
          }, 1000);

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
  });
