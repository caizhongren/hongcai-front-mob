'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.login
 * @description
 * # login
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('Login', function (restmod) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return restmod.model('/ipa/hongcai/users/login');
  });
