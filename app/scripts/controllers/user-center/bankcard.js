'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BankcardCtrl
 * @description
 * # BankcardCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('BankcardCtrl',['$scope', '$rootScope', 'HongcaiUser', function ($scope, $rootScope, HongcaiUser) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/bankcard').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户的银行卡信息
          $scope.simpleBankcard = response;
        } else {
          // 获取信息失败。
        }
      });
    }
  }]);
