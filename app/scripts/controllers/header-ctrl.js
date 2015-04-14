'use strict';
angular.module('p2pSiteMobApp')
  .controller('HeaderCtrl', ['$scope', '$location', '$state', '$rootScope', '$stateParams', function($scope, $location, $state, $rootScope, $stateParams) {

    $rootScope.showMe = false;
    $scope.toggle = function () {
        $rootScope.showMe = !$rootScope.showMe;
    }

   
   
  }]);
