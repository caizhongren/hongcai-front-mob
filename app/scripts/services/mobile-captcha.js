'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.mobileCaptcha
 * @description
 * # mobileCaptcha
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('mobileCaptcha', function (restmod, DEFAULT_DOMAIN) {
    return restmod.model(DEFAULT_DOMAIN + '/users/mobileCaptcha');
    // AngularJS will instantiate a singleton by calling "new" on this function
  });
