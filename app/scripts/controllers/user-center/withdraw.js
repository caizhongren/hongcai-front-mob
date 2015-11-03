'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:WithdrawCtrl
 * @description
 * # WithdrawCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('WithdrawCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', function($scope, $rootScope, $state, HongcaiUser) {
    $rootScope.selectedSide = 'account';


    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/availableCash').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户充值信息
          $scope.simpleWithdraw = response;
          $scope.availableCash = $scope.simpleWithdraw.availableCash;
          $scope.availableCashRealNo = $scope.availableCash >= 2 ? $scope.availableCash - 2 : 0;
          $scope.toWithdraw = function(simpleWithdraw) {
            // $scope.msg = '3';
            var amount = simpleWithdraw.amountDraw;

            $state.go('root.yeepay-transfer', {
              type: 'withdraw',
              number: amount
            });
          }
        } else {
          // 获取信息失败。
        }
        });
    
    });

  /**
   * 绑定银行卡
   */
  $scope.bindBankcard = function(){
    if($scope.simpleWithdraw.cardStatus == 'VERIFIED' || $scope.simpleWithdraw.cardStatus == 'VERIFYING'){
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
  }]);
