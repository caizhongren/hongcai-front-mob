'use strict';

angular.module('p2pSiteMobApp')
  .controller('SceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN) {

    // restmod.model(DEFAULT_DOMAIN + '//scenes')
    //   .$create().$then(function(response) {
    //     console.log(response);
    //   });
    // Restangular.one('sceneActivity', $rootScope.userInfo.id).one('myFreeWish').get().then(function(response) {
    //   if (response !== undefined) {
    //     if (response.id > 0) {
    //       $scope.myFreeWish = response;
    //       $scope.buttonFlag = 2;
    //       if ($scope.myFreeWish.status === 6) {
    //         $scope.buttonFlag = 3;
    //       }
    //     }
    //   }
    // });
    Restangular.one('sceneActivity','scenes').getList().then(function(response){
    	$scope.scenesData = response;

    });

    console.log(Restangular.one('sceneActivity','scenes').getList());

    
  });
