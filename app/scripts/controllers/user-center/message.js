'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('MessageCtrl', ['$scope', '$rootScope', 'HongcaiUser', function ($scope, $rootScope, HongcaiUser) {


    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      
    });

    $scope.activeTab = 0;
  
  }]);
