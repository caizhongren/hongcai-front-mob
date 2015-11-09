'use strict';
angular.module('desire')
  .factory('Wechat', function(restmod) {
    return restmod.model('/hongcai/rest/wechat');
  });
