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

    $scope.data = [{
        percentage:0.1,
        color:'#2b8bf1',
        title:'宏财精选'
      },{
        percentage:0.2,
        color:'#0460cd',
        title:'宏财尊贵'
      },{
        percentage:0.4,
        color:'#ffaa25',
        title:'债权转让'
      },{
        percentage:0.3,
        color:'#ffc425',
        title:'其他'
      }];
   

   
    
});
