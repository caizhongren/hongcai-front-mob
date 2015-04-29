'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectListCtrl
 * @description
 * # ProjectListCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectListCtrl', ['$scope', 'projects', 'fundsProjects', function ($scope, projects, fundsProjects) {
    // 宏金盈列表
    $scope.page = 1;
    $scope.pageSize = 4;
    $scope.fundsProjectLists = fundsProjects.$find('/', {page: $scope.page, pageSize: $scope.pageSize});
    $scope.projectList = projects.$find('/', {page: $scope.page, pageSize: $scope.pageSize});

    // 加载更多宏金保项目
    $scope.loadMore = function() {
      $scope.pageSize = $scope.pageSize + 8;
      $scope.projectList = projects.$find('/', {page: $scope.page, pageSize: $scope.pageSize});
    };
    // 加载更多宏金盈项目
    $scope.loadFundsMore = function() {
      $scope.pageSize = $scope.pageSize + 8;
      $scope.fundsProjectLists = fundsProjects.$find('/', {page: $scope.page, pageSize: $scope.pageSize});
    };
  }]);
