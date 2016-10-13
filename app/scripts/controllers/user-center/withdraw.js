'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:WithdrawCtrl
 * @description
 * # WithdrawCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('WithdrawCtrl', function($scope, $rootScope, $state, HongcaiUser, fundsProjects) {
    $rootScope.selectedSide = 'account';


    $rootScope.checkSession.promise.then(function() {
      if (!$rootScope.isLogged) {
        $state.go('root.login');
      }

      HongcaiUser.$find('0' + '/availableCash').$then(function(response) {
        if (response.ret !== -1) {
          // 获取用户充值信息
          $scope.simpleWithdraw = response;
          $scope.availableCash = $scope.simpleWithdraw.account.balance;
          $scope.availableCashRealNo = $scope.availableCash >= 2 ? $scope.availableCash - 2 : 0;

        } else {
          // 获取信息失败。
        }
      });

      HongcaiUser.$find('0' + '/bankcard').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户的银行卡信息
          $scope.simpleBankcard = response;
        } else {
          // 获取信息失败。
        }
      });
    });



    // 跳转到零存宝详情页
    $scope.toInvestCurrentDeposit = function() {
      fundsProjects.$find('recommendations', {
        productType: 1
      }).$then(function(response) {
        if (response.ret !== -1) {
          $state.go('root.current-deposit-detail', {
            number: response.number
          });
        } else {

        }
      });
    }



    /**
     * 提现
     */
    $scope.toWithdraw = function(simpleWithdraw) {
      // $scope.msg = '3';
      var amount = simpleWithdraw.amountDraw;
      if (!amount || amount < 1) {
        return;
      }
      if ($scope.simpleWithdraw.amountDraw > $scope.availableCashRealNo) {
        return;
      }
      $state.go('root.yeepay-transfer', {
        type: 'withdraw',
        number: amount
      });
    }

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


    $scope.checkMaxAmount = function(simpleWithdraw) {
      if (simpleWithdraw.amount > simpleWithdraw.availableCash) {
        return true;
      } else {
        return false;
      }
    };
  });
