'use strict';
angular.module('p2pSiteMobApp')
  .factory('wechat', function(restmod, DEFAULT_DOMAIN) {
    return restmod.model(DEFAULT_DOMAIN + '/wechat');
  });

