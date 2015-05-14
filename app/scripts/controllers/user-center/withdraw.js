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
    $rootScope.selectedSide =  'account';
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户充值信息
          $scope.simpleWithdraw = response;
          $scope.withdraw = function(amount) {
            /*$scope.msg = '3';
            $scope.withdrawAmount = amount;
            $alert({
              scope: $scope,
              template: 'views/modal/alertYEEPAY.html',
              show: true
            });*/

            window.open('/#/yeepay-transfer/withdraw/' + amount);
          }
        } else {
          // 获取信息失败。
        }
      });
    }
  }]);
