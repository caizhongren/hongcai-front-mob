'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.isEnsureUnique
 * @description
 * # isEnsureUnique
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('isEnsureUnique', function (restmod, DEFAULT_DOMAIN) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return restmod.model(DEFAULT_DOMAIN + '/users/isUnique');
  });
