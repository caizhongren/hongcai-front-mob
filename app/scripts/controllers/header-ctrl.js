'use strict';
angular.module('p2pSiteMobApp')
  .controller('HeaderCtrl', ['$scope', '$location', '$state', '$rootScope', '$stateParams', 'HongcaiLogin', function($scope, $location, $state, $rootScope, $stateParams, HongcaiLogin) {

    $rootScope.showMe = false;
    $scope.toggle = function () {
        $rootScope.showMe = !$rootScope.showMe;
    }


    $scope.toLogout = function(user) {
      
    };
   
  }]);
