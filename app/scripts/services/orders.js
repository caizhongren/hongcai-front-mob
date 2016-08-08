'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.orders
 * @description
 * # orders
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
/*  .service('orders', function (restmod, DEFAULT_DOMAIN) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return restmod.model(DEFAULT_DOMAIN + '/orders');

  });*/
  .controller('OrderCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', function($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {

    $rootScope.selectedSide =  'investments-stat';

    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find('0' + '/orders').$then(function(response) {
        if (response.$status === 'ok') {
          $scope.simpleOrder = response;
        } else {
          //
        }
      });

    }
  }]);

