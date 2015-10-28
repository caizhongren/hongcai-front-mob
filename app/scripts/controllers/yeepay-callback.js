'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:YeepayCallbackCtrl
 * @description
 * # YeepayCallbackCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('YeepayCallbackCtrl', function ($rootScope, $scope, $state, $stateParams) {
    $scope.page = '0';
    $scope.amount = $stateParams.amount;
    var business = $stateParams.business;

    if (business === 'RECHARGE'){
    	$scope.page = 1;
    } else if(business === 'WITHDRAW') {
    	$scope.page = 2;
    } else if (business === 'TRANSFER'){
    	$scope.page = 3;
    }


    console.log($scope.amount);

  });
