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
    $scope.fundsProjects = fundsProjects.$find('recommendations');
    console.log($scope.fundsProjects);
    $scope.toggle = {};
    $scope.tabs = [{
      title: '7日理财',
      content: $scope.fundsProjects[0]
    }, {
      title: '1-6月理财'
    }];
    $scope.tabs_sub = [{
      title: '月月盈',
      content: $scope.fundsProjects[1]
    }, {
      title: '季度盈',
      content: $scope.fundsProjects[2]
    }, {
      title: '半年盈',
      content: $scope.fundsProjects[3]
    }];

    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
    };
    $scope.toggle.switchSubTab = function(subTabIndex) {
      $scope.toggle.activeSubTab = subTabIndex;
    };

  }]);
