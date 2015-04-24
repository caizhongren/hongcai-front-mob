'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AccountCtrl', ['$scope', '$rootScope', 'HongcaiUser',function ($scope, $rootScope, HongcaiUser) {
    if ($rootScope.hasLoggedUser) {
      $scope.userAccount = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/account');
    }
  }]);
