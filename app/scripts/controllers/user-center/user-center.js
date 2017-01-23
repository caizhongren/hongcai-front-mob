'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('UserCenterCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {


    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      HongcaiUser.$find('0' + '/account').$then(function(response) {
        $scope.userAccount = response;
      });


    });

    $rootScope.checkSession.promise.then(function() {
      /**
       * 是否激活存管通
       */
       $rootScope.toActivate();
    });
    // 退出登录功能
    $scope.toLogout = function() {
      // var
      if ($rootScope.hasLoggedUser) {
        // TODO  登出的model在这里不太好吧。
        var logoutModel = restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/logout');
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
    /*$scope.toggle = {};
    $scope.subTabs = [{
      title: '持有中',
    }, {
      title: '已回款',
    }];

    $scope.toggle.switchSubTab = function(subTabIndex) {
      $scope.toggle.activeSubTab = subTabIndex;
    };*/

  }]);
