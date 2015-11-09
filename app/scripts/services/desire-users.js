'use strict';
angular.module('p2pSiteMobApp')
  .factory('DesireUser', function(restmod) {
	return restmod.model('/hongcai/rest/desireUsers');
  });
