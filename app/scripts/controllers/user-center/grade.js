'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:GradeCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('GradeCtrl',['$scope',function ($scope) {
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '体验金',
    }, {
      title: '加息券',
    }, {
      title: '邀请',
    }];
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };

  }]);

