'use strict';
angular.module('p2pSiteMobApp')
  .factory('Wishes', function(restmod) {
    return restmod.model('/hongcai/rest/wishes');
  });
