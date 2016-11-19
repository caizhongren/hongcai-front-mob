/*
 * @Author: fuqiang1
 * @Date:   2016-08-09 11:23:50
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-11 16:06:42
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CreditSecurityCtrl', function($scope, $state, $stateParams, Restangular, restmod, WEB_DEFAULT_DOMAIN) {
    $scope.number = $stateParams.number;
    /**
     * 
     */
    Restangular.one('creditRights').one($scope.number + '/creditRightBills').get({}).then(function(response) {
      if(response && response.ret !== -1) {
        $scope.credits = response;
        console.log($scope.credits);
      }
      
    });
    /**
     * 债权详情、项目信息、加息券信息
     */
    Restangular.one('creditRights').one($scope.number + '/creditDetail').get({}).then(function(response) {
      $scope.creditRight = response.creditRight;
      $scope.project = response.project;
      $scope.increaseRateCoupon = response.increaseRateCoupon;
      $scope.projectBill = response.projectBill;
      // 年化收益率
      $scope.annualEarnings = $scope.creditRight.type == 1 ? $scope.project.annualEarnings : $scope.creditRight.baseRate + $scope.creditRight.riseRate;
      // $scope.projectDays = $scope.creditRight.type == 1 ? $scope.project.projectDays : new Date($scope.fundsProject.repaymentDate - $scope.fundsProject.loanTime).getDate();
    });


  });
