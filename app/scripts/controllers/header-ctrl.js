'use strict';
angular.module('p2pSiteMobApp')
  .controller('HeaderCtrl', ['$scope', '$location', '$state', '$rootScope', '$stateParams', 'restmod', 'DEFAULT_DOMAIN', function($scope, $location, $state, $rootScope, $stateParams, restmod, DEFAULT_DOMAIN) {

    $rootScope.showMe = false;
    $scope.toggle = function () {
        $rootScope.showMe = !$rootScope.showMe;
    };

  }]);
