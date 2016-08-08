'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:InvestmentsStatCtrl
 * @description
 * # InvestmentsStatCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('InvestmentsStatCtrl', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN, config) {

    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      HongcaiUser.$find('0' + '/investments/stat').$then(function(response) {
        $scope.investmentsStat = response;
        if(response.notPayOrder){
          $scope.investmentsStat.notPayOrder.dueTime = ($scope.investmentsStat.notPayOrder.createTime  + 5 * 60 * 1000 - $scope.investmentsStat.serverTime)/(1000* 60);
        }
      });

    });


    /**
     * 继续支付未支付的订单
     */
    $scope.toInvest = function(notPayOrder) {
      $state.go('root.yeepay-transfer', {
        type: 'transfer',
        number: notPayOrder.number
      });
    }



  });
