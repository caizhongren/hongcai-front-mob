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
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/investments/stat').$then(function(response) {
        if (response.$status === 'ok') {
          $scope.investmentsStat = response;
        } else {
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
