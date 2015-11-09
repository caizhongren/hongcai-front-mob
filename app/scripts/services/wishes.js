'use strict';
angular.module('desire')
  .factory('Wishes', function(restmod) {
    return restmod.model('/hongcai/rest/wishes');
  });
