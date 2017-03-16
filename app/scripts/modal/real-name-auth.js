'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RealNameAuth
 * @description
 * # LoginCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RealNameAuthCtrl', function($scope, $state, $uibModalInstance, toCunGuanUtils) {


    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

    /**
     * 实名认证，即开通易宝
     */
    $scope.realNameAuth = function(user){
      if (!user.realName || !user.idNo){
        // $scope.errMsg = '请输入姓名或身份证号';
        return;
      }


      $scope.cancel();
      toCunGuanUtils.to('register', null, register, user.idNo, null, null);
    }

  });
