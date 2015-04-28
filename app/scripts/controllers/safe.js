'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SafeCtrl
 * @description
 * # SafeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('SafeCtrl', function ($scope) {
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '资金保障',
    }, {
      title: '资金托管',
    }, {
      title: '风控体系',
    }, {
      title: '法律支持',
    }];
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };
  });
