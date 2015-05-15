'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:DealCtrl
 * @description
 * # DealCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('DealCtrl', ['$rootScope', '$scope', 'HongcaiUser', function ($rootScope, $scope, HongcaiUser) {
    $rootScope.selectedSide =  'account';
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/deals').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户交易记录
          $scope.deals = response;
        } else {
          // 获取信息失败。
        }
      });
    }
  }]);
