'use strict';
angular.module('p2pSiteMobApp')
  .factory('Wechat', function(restmod) {
    return restmod.model('/hongcai/rest/wechat');
  });
