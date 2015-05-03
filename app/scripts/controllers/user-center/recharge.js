'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RechargeCtrl
 * @description
 * # RechargeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RechargeCtrl', function ($scope) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/recharge').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户充值信息
          $scope.simpleRecharge = response;
        } else {
          // 获取信息失败。
        }
      });
    }
  });
