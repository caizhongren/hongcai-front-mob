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
    $scope.fundsProjectLists = fundsProjects.$find('/');
    // TODO
    // 列表页面的记载更多
    // 宏金保列表
    $scope.projectList = projects.$find('/');

  }]);
