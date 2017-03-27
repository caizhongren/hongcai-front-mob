'use strict';
angular.module('p2pSiteMobApp')
  .factory('HongcaiUser', function(restmod, DEFAULT_DOMAIN) {
    return restmod.model(DEFAULT_DOMAIN + '/users');
  });
