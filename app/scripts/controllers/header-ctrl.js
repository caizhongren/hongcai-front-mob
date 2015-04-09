'use strict';
angular.module('p2pSiteMobApp')
  .controller('HeaderCtrl', ['$scope', '$location', '$state', '$rootScope', '$stateParams', function($scope, $location, $state, $rootScope, $stateParams) {

    $scope.showMe = false;
    $scope.toggle = function () {
        $scope.showMe = !$scope.showMe;
    }

   
   
  }]);
