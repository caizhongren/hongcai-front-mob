'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:WithdrawCtrl
 * @description
 * # WithdrawCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('WithdrawCtrl', function($scope, $rootScope, $state, Restangular, fundsProjects, toCunGuanUtils, Utils) {
    $rootScope.selectedSide = 'account';
    $scope.footer = function(){
      if (Utils.deviceCode() == 5 || Utils.deviceCode() == 6) {
        $rootScope.showFooter = !$rootScope.showFooter;
      }
    }
    Restangular.one('users/0').one('availableCash').get().then(function(response) {
      if (response.ret !== -1) {
        // 获取用户充值信息
        $scope.simpleWithdraw = response;
        $scope.availableCash = $scope.simpleWithdraw.account.balance;
        $scope.availableCashRealNo = $scope.availableCash >= 2 ? $scope.availableCash - 2 : 0;

      } else {
        // 获取信息失败。
      }
    });

    Restangular.one('users/0').one('bankcard').get({}, function(response) {
      if (response.$status === 'ok') {
        // 获取用户的银行卡信息
        $scope.simpleBankcard = response;
      } else {
        // 获取信息失败。
      }
    });



    // 跳转到零存宝详情页
    $scope.toInvestCurrentDeposit = function() {
      fundsProjects.one('recommendations', {
        productType: 1
      }).get().then(function(response) {
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
      toCunGuanUtils.to('withdraw', amount, null, null, null, null);
    }

    /**
     * 绑定银行卡
     */
    $scope.bindBankcard = function() {
      if ($scope.simpleWithdraw.cardStatus == 'VERIFIED' || $scope.simpleWithdraw.cardStatus == 'VERIFYING') {
        return;
      }
      toCunGuanUtils.to('BIND_BANK_CARD', null, null, null, null, null);
    }


    $scope.checkMaxAmount = function(simpleWithdraw) {
      if (simpleWithdraw.amount > simpleWithdraw.availableCash) {
        return true;
      } else {
        return false;
      }
    };
  });
