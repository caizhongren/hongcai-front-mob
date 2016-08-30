/*
 * @Author: Administrator
 * @Date:   2016-08-22 18:44:36
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-23 16:39:01
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ActivateCtrl', function($scope, $state, $uibModalInstance) {
    $scope.showActivateTip = true;
    $scope.cancel = function() {
      $scope.showActivateTip = false;
    };

    /**
     * 立即迁移
     */

  });
