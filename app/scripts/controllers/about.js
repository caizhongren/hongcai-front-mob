'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AboutCtrl', function($scope, $stateParams, $rootScope) {
    $scope.tab = parseInt($stateParams.tab) || 0;
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '宏财简介',
    }, {
      title: '高管团队',
    }, {
      title: '战略伙伴',
    }, {
      title: '联系我们'
    }];
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };
    $scope.toggle.switchTab($scope.tab);

});
