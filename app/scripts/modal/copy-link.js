/*
* @Author: fuqiang1
* @Date:   2016-09-27 17:16:52
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-28 10:30:09
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CopyLinkCtrl', function($scope, $state, $location, $uibModalInstance, HongcaiUser, ngClipboard) {

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     * 实名认证，即开通易宝
     */
    $scope.btnInner = '复制链接';
    $scope.copyLink = function(){
      $scope.btnInner = '复制成功';
      ngClipboard.toClipboard('http://www.hongcai.com/register?inviteCode=' + $scope.voucher.inviteCode);
    }
    /**
     * 邀请码
     */
    $scope.voucher = HongcaiUser.$find('0' + '/voucher').$then();
    //链接
    $scope.inviteUrl = "http://www.hongcai.com/register?inviteCode=" + $scope.voucher.inviteCode;

  });
