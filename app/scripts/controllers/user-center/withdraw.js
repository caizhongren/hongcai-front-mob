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
        return;
      }

      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户充值信息
          $scope.simpleWithdraw = response;
          $scope.availableCash = $scope.simpleWithdraw.availableCash;
          $scope.availableCashRealNo = $scope.availableCash >= 2 ? $scope.availableCash - 2 : 0;
          $scope.toWithdraw = function(simpleWithdraw) {
            // $scope.msg = '3';
            var amount = simpleWithdraw.amountDraw;
            // $alert({
            //   scope: $scope,
            //   template: 'views/modal/alertYEEPAY.html',
            //   show: true
            // });
            $state.go('root.yeepay-transfer', {
              type: 'withdraw',
              number: amount
            });
            // window.open('/#/yeepay-transfer/withdraw/' + amount);
          }
        } else {
          // 获取信息失败。
        }
        });
    
    });
    

    $scope.checkMaxAmount = function(simpleWithdraw) {
      if (simpleWithdraw.amount > simpleWithdraw.availableCash) {
        return true;
      } else {
        return false;
      }
    };
  }]);
