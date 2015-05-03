'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', ['$state', '$rootScope', 'HongcaiUser', function($scope, $rootScope, HongcaiUser) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/credits').$then(function(response) {
        if (response.$status === 'ok') {
          $scope.simpleCredits = response;
        } else {
          //
        }
      });
      // 接口还没部署到43
      // console.log($scope.simpleCredits);
    }
  }]);
