'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', ['$scope', '$state', 'projects', 'fundsProjects', function ($scope, $state, projects, fundsProjects) {

    // 获取宏金宝投资列表
    // $scope.projectsRecommendations = projects.$find('recommendations');
    // 获取宏金盈投资列表
    $scope.fundsProjectsRecommendations = fundsProjects.$find('recommendations');
    $scope.toggle = {};
    $scope.tabs = [{
      title: '7日理财',
    }, {
      title: '1-6月理财',
    }];

    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };

  }]);
