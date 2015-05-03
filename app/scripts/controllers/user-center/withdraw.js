'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:WithdrawCtrl
 * @description
 * # WithdrawCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('WithdrawCtrl', ['$scope','$rootScope','HongcaiUser',function ($scope, $rootScope, HongcaiUser) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/withdraw').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户充值信息
          $scope.simpleWithdraw = response;
        } else {
          // 获取信息失败。
        }
      });
    }
  });
