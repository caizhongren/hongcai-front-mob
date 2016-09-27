/*
* @Author: fuqiang1
* @Date:   2016-09-27 17:16:52
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-27 19:18:34
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CopyLinkCtrl', function($scope, $state, $location, $uibModalInstance, HongcaiUser) {

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
    /**
     * 邀请码
     */
    $scope.voucher = HongcaiUser.$find('0' + '/voucher').$then();
    //链接
    $scope.inviteUrl = "http://www.hongcai.com/register?inviteCode=" + $scope.voucher.inviteCode;

    //实例化clipboard对象
    new Clipboard('#copt-btn');


  });
