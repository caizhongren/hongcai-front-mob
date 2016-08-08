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
          $scope.recharge = function(amount) {
            /*$scope.msg = '2';
            $scope.rechargeAmount = amount;
            $alert({
              scope: $scope,
              template: 'views/modal/alertYEEPAY.html',
              show: true
            });*/
            $state.go('root.yeepay-transfer', {
              type: 'recharge',
              number: amount
            });
            // window.open('/#/yeepay-transfer/recharge/' + amount);
          };
        } else {
          // 获取信息失败。
        }
      });
    });


  });
