'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.orders
 * @description
 * # orders
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('orders', function (restmod, DEFAULT_DOMAIN) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return restmod.model(DEFAULT_DOMAIN + '/orders');
  });
