'use strict';
angular.module('p2pSiteMobApp')
  .factory('HongcaiUser', function(restmod) {
    return restmod.model('/hongcai/rest/users');
  });
