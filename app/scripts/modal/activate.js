/*
 * @Author: Administrator
 * @Date:   2016-08-22 18:44:36
 * @Last Modified by:   Administrator
 * @Last Modified time: 2016-08-22 18:57:02
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ActivateCtrl', function($scope, $state, $uibModalInstance) {


    $scope.cancel = function() {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     * 立即迁移
     */

  });
