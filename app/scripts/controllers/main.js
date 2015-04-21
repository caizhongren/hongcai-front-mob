'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', ['$scope', 'projects', 'fundsProjects', function ($scope, projects, fundsProjects) {

    // 获取宏金宝投资列表
    $scope.projectsRecommendations = projects.$find('recommendations');
    // 获取宏金盈投资列表
    $scope.fundsProjectsRecommendations = fundsProjects.$find('recommendations');
  }]);
