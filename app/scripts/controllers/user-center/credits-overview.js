'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # CreditsOverviewCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('CreditsOverviewCtrl', function ($scope, $state, DEFAULT_DOMAIN, Restangular) {

    $scope.totalInvestAmount = 0;
    $scope.investStat = {
      selection: 0,
      hornor:0,
      assignment:0,
      holdingAmount: 0
    }

    $scope.showOther =false;

    /**
    * 所有投资查询
    **/
    Restangular.one('/users/0/investments/typeStat').get({}).then(function(response){
      if(!response || response.ret == -1){
        return;
      }
      $scope.investStat.holdingAmount = 0;
      for(var i = 0;i<response.length;i++) {
        var stat = response[i];
        $scope.investStat.holdingAmount = $scope.investStat.holdingAmount+ stat.holdingAmount;
        if(stat.creditRightType == 7){
           $scope.investStat.selection = stat.holdingAmount;
        } else if(stat.creditRightType == 8) {
          $scope.investStat.hornor = stat.holdingAmount;
        } else if (stat.creditRightType == 6) {
          $scope.investStat.assignment = stat.holdingAmount;
        } else if(stat.creditRightType == 3){
          $scope.showOther = true;
        }

      }

   });
    
});
