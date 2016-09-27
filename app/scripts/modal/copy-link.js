/*
* @Author: fuqiang1
* @Date:   2016-09-27 17:16:52
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-27 17:32:35
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CopyLinkCtrl', function($scope, $state, $uibModalInstance) {

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     * 实名认证，即开通易宝
     */
    $scope.btnInner = '复制链接';
    $scope.copyLink = function(user){
      // $scope.showCopyWindow = true;
      $scope.btnInner = '复制成功';
    }

  });
