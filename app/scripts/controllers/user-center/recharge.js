'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RechargeCtrl
 * @description
 * # RechargeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RechargeCtrl', ['$scope', '$rootScope', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', function ($scope, $rootScope, HongcaiUser, restmod, DEFAULT_DOMAIN) {
    $rootScope.selectedSide =  'account';
    $scope.rechargeAmount = '';
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户金额信息
          $scope.userAccount = response;
          // 充值
          /*$scope.recharge = function(){
            var rechargeModel = restmod.model(DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.user.id + '/recharge');
            rechargeModel.$create({'amount':$scope.rechargeAmount}).$then(function(response) {
              if (response.$status === 'ok') {
                // 获取用户充值信息
                $scope.simpleRecharge = response;
              } else {
                  // 获取信息失败。
              }
            });
          };*/

          $scope.recharge = function(amount) {
            /*$scope.msg = '2';
            $scope.rechargeAmount = amount;
            $alert({
              scope: $scope,
              template: 'views/modal/alertYEEPAY.html',
              show: true
            });*/
            window.open('/#/yeepay-transfer/recharge/' + amount);
          };



        } else {
          // 获取信息失败。
        }
      });


    }
  }]);
