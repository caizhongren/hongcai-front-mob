/*
 * @Author: fuqiang1
 * @Date:   2016-08-09 11:23:50
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-10 21:02:30
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CreditSecurityCtrl', function($scope, $state, $stateParams, Restangular, restmod, WEB_DEFAULT_DOMAIN) {
    $scope.id = $stateParams.id;
    $scope.curDate = new Date().getTime();
    $scope.loanTime = $stateParams.time;
    /**
     * 获取投资项目详情
     */
    Restangular.one('creditRights').one($scope.id + '/projectBills').get({}).then(function(response) {
      $scope.credits = [];
      for (var i = 0; i < response.length; i++) {
        $scope.credits.push(response[i]);
      }
      $scope.totalInv = response[0].remainPrincipal;

    });


  });
