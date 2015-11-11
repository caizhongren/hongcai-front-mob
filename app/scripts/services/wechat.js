'use strict';
angular.module('p2pSiteMobApp')
  .factory('wechat', function(restmod) {
    return restmod.model('/hongcai/rest/wechat');
  });

