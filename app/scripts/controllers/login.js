'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('LoginCtrl', function($timeout, $scope, $state, $rootScope, $stateParams, $location, md5, ipCookie, HongcaiLogin, SessionService, WEB_DEFAULT_DOMAIN) {
    // 默认登陆密码登录
    $scope.isPassward = true;
    $scope.changeLogin = function() {
      $scope.isPassward = !$scope.isPassward;
    }

    // 获取用户的openId
    var openId = $stateParams.openId;
    var redirectUrl = $stateParams.redirectUrl;
    var loginBe;

    if (ipCookie('userName')) {
      $scope.user = [];
      $scope.user.account = ipCookie('userName');
    }
    $scope.busy = false;

    /**
     * 密码登录
     */
    $scope.toLogin = function(user) {
      
      user.password = user.password.replace(/\s/g, "");
      if(!user.password || !user.account){
        $rootScope.showMsg('账号或密码不能为空');
        return;
      }
      
      if($scope.busy){
        return;
      }
      $scope.busy = true;

      if ($scope.rememberUserName) {
        ipCookie('userName', user.account, {
          expires: 60
        });
      }
      
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

          SessionService.loginSuccess(response.$response.data);
          if (redirectUrl) {
            $location.url(decodeURIComponent(redirectUrl));
            // console.log($location.path(decodeURIComponent(redirectUrl)));
            return;
          }
          
          $state.go('root.main');
        }
      });
    };


    /**
     * 验证码登录
     */


    //图形验证码
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };
  });
