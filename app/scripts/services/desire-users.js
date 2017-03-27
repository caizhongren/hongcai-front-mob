'use strict';
angular.module('p2pSiteMobApp')
  .factory('DesireUser', function(restmod, DEFAULT_DOMAIN) {
	return restmod.model(DEFAULT_DOMAIN + '/desireUsers');
  });
