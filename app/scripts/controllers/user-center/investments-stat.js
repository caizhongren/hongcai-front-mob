'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:InvestmentsStatCtrl
 * @description
 * # InvestmentsStatCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
/*  .controller('InvestmentsStatCtrl', ['$state', '$rootScope', 'HongcaiUser',function ($scope, $rootScope, HongcaiUser) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.user.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户投资信息
          $scope.userAccount = response;

        } else {
          // 获取信息失败。
        }
      });
    }
    $rootScope.selectedSide =  'investments-stat';
  }]);*/
  .controller('InvestmentsStatCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.user.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户金额信息
          $scope.userAccount = response;
        } else {
          // 获取信息失败。
        }
      });
    }

    $rootScope.selectedSide =  'investments-stat';

    // 退出登录功能
    $scope.toLogout = function() {
      // var
      if ($rootScope.hasLoggedUser) {
        // TODO  登出的model在这里不太好吧。
        var logoutModel = restmod.model(DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.user.id + '/logout');
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
