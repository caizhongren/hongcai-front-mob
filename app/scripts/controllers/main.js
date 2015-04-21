'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', ['$scope','HongcaiUser', function ($scope,HongcaiUser) {
    // 测试组合URL的调用
    $scope.localUser = HongcaiUser.$find(402042, {includeParts: true});
  }]);
