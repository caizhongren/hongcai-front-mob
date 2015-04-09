'use strict';
angular.module('p2pSiteMobApp')
  .factory('User', function(restmod) {
    return restmod.model('/ipa/admin/users');
  });
