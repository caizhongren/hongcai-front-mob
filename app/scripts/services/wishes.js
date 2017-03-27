'use strict';
angular.module('p2pSiteMobApp')
  .factory('Wishes', function(restmod, DEFAULT_DOMAIN) {
    return restmod.model(DEFAULT_DOMAIN + '/wishes');
  });
