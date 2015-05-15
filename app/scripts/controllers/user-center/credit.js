'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', function($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {
    
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '持有中',
    }, {
      title: '已回款',
    }];

    $rootScope.selectedSide =  'investments-stat';

    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };

    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/credits').$then(function(response) {
        if (response.$status === 'ok') {
          $scope.simpleCredits = response;
        } else {
          //
        }
      });
      // 接口还没部署到43
      // console.log($scope.simpleCredits);
    }
  }]);
