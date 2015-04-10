'use strict';

/**
 * @ngdoc service
 * @name p2pSiteMobApp.hongcaiLogin
 * @description
 * # hongcaiLogin
 * Service in the p2pSiteMobApp.
 */
angular.module('p2pSiteMobApp')
  .service('HongcaiLogin', function (restmod) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return restmod.model('/ipa/hongcai/users/login');
  });
