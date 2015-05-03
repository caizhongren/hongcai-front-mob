'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:InvestmentsStatCtrl
 * @description
 * # InvestmentsStatCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('InvestmentsStatCtrl', ['$state', '$rootScope', 'HongcaiUser',function ($scope, $rootScope, HongcaiUser) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/investments/stat').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户投资信息
          $scope.simpleInvestmentsStat = response;
        } else {
          // 获取信息失败。
        }
      });
    }
  }]);
