'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.register
 * @description
 * # register
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('register', function (restmod, DEFAULT_DOMAIN) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return restmod.model(DEFAULT_DOMAIN + '/users/register')
  });
