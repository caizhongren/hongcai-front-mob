'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RechargeCtrl
 * @description
 * # RechargeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RechargeCtrl', function($scope, $rootScope, $stateParams, HongcaiUser, $state, restmod, DEFAULT_DOMAIN, WEB_DEFAULT_DOMAIN, Restangular) {
    $rootScope.selectedSide = 'account';
    $scope.rechargeAmount = $stateParams.amount;

    // 获取用户的银行卡剩余额度
    var siteBankLimit = restmod.model(WEB_DEFAULT_DOMAIN + "/bank/getUserRechargeRemainLimit?bankCode="+$rootScope.securityStatus.userId+"&payCompany="+"FUIOU");
    siteBankLimit.$create({}).$then(function(response) {
        if (response.ret !== -1) {
          $scope.bankRemain = response.data.bankRemain;
        }
      });


    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
        return;
      }
    });

    $scope.recharge = function(amount) {
      $state.go('root.yeepay-transfer', {
        type: 'recharge',
        number: amount
      });
    };

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
