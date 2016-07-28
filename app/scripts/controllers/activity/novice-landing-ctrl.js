/*
* @Author: fuqiang1
* @Date:   2016-07-28 17:08:11
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-07-28 17:10:09
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('NoviceCtrl', function($scope, Restangular) {
    /**
     * 获取新手标项目
     */
    Restangular.one('projects').one('newbieBiaoProject').get().then(function(response) {
      if(!response || response.ret === -1){
          return;
      }
      $scope.newbieBiaoProject = response;
      // 可投资金额
      $scope.newbieBiaoProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;

    });

  });
