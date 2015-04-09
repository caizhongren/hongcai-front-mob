'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl',['$scope', 'User', 'HongcaiUser', function ($scope, User, HongcaiUser) {
    $scope.user = User.$find(1);
    $scope.oneHongcaiUser = HongcaiUser.$find(402016);
  }]);
