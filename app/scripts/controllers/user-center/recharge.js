'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RechargeCtrl
 * @description
 * # RechargeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RechargeCtrl', function($scope, $rootScope, $stateParams, HongcaiUser, $state, restmod, DEFAULT_DOMAIN) {
    $rootScope.selectedSide = 'account';
    $scope.rechargeAmount = $stateParams.amount;

    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      HongcaiUser.$find('0' + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户金额信息
          $scope.userAccount = response;
          // 充值
          // $scope.recharge = function(amount) {
          //   $state.go('root.yeepay-transfer', {
          //     type: 'recharge',
          //     number: amount
          //   });
          // };

          $scope.recharge = function(amount) {
            $state.go('root.yeepay-transfer', {
              type: 'recharge',
              number: amount
            });
          };
        } else {
          // 获取信息失败。
        }
      });

      HongcaiUser.$find('0' + '/availableCash').$then(function(response) {
        if (response.ret !== -1) {
          // 获取用户充值信息
          $scope.simpleWithdraw = response;
        } else {
          // 获取信息失败。
        }
      });

      /**
       * 绑定银行卡
       */
      $scope.bindBankcard = function() {
        if ($scope.simpleWithdraw.cardStatus == 'VERIFIED' || $scope.simpleWithdraw.cardStatus == 'VERIFYING') {
          return;
        }

        $state.go('root.yeepay-transfer', {
          type: 'BIND_BANK_CARD'
        });
      }

    });


  });
