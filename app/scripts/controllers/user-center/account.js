'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AccountCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {
/*    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.user.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户金额信息
          // $scope.userAccount = response;
        } else {
          // 获取信息失败。
        }
      });
    }*/

    $rootScope.selectedSide =  'account';

    // 退出登录功能
    $scope.toLogout = function() {
      // var
      if ($rootScope.hasLoggedUser) {
        // TODO  登出的model在这里不太好吧。
        var logoutModel = restmod.model(DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.id + '/logout');
        logoutModel.$create().$then(function(response) {
          if (response.ret === 1) {
            $rootScope.hasLoggedUser = null;
            $rootScope.isLogged = false;
            $state.go('root.main');
          }
        });
      }
    };

    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '账户总览',
    }, {
      title: '我的投资'
    }];

  }]);
