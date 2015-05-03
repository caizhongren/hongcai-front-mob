'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('MessageCtrl', ['$scope', '$rootScope', 'HongcaiUser', function ($scope, $rootScope, HongcaiUser) {
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
  }]);
