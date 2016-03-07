'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSpringHomeCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config, DialogService) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

    $scope.test = config.test;
    $scope.freeWishes = Restangular.one('freeWishes').getList().$object;

});
