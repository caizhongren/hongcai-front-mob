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


    if(!$rootScope.isLogged){
      $state.go('root.login');
    }

    HongcaiUser.$find('0' + '/account').$then(function(response) {
      $scope.userAccount = response;
    });


    /**
     * 是否激活存管通
     */
      $rootScope.toActivate();

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
