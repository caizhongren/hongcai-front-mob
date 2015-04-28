'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:IssueCtrl
 * @description
 * # IssueCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('IssueCtrl', function ($scope) {
    $scope.toggle = {};
    $scope.tabs = [{
      title: '七日盈',
    }, {
      title: '月月盈',
    }, {
      title: '季度盈',
    }, {
      title: '半年盈',
    }];
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };
  });
