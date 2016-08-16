/*
 * @Author: fuqiang1
 * @Date:   2016-08-09 11:23:50
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-08-11 16:06:42
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('CreditSecurityCtrl', function($scope, $state, $stateParams, Restangular, restmod, WEB_DEFAULT_DOMAIN) {
    $scope.id = $stateParams.id;
    /**
     * 回款信息
     */
    Restangular.one('creditRights').one($scope.id + '/projectBills').get({}).then(function(response) {
      for (var i = 0; i < response.length; i++) {
        $scope.credits = response;
      }

    });
    /**
     * 债权详情、项目信息、加息券信息
     */
    Restangular.one('creditRights').one($scope.id + '/creditDetail').get({}).then(function(response) {
      $scope.creditRight = response.creditRight;
      $scope.fundsProject = response.fundsProject;
      $scope.project = response.project;
      $scope.increaseRateCoupon = response.increaseRateCoupon;
      // 年化收益率
      $scope.annualEarnings = $scope.creditRight.type == 1 ? $scope.project.annualEarnings : $scope.creditRight.baseRate + $scope.creditRight.riseRate;
      $scope.loanTime = $scope.creditRight.type == 1 ? $scope.project.loanTime : $scope.fundsProject.loanTime;
      $scope.projectDays = $scope.creditRight.type == 1 ? $scope.project.projectDays : new Date($scope.fundsProject.repaymentDate - $scope.fundsProject.loanTime).getDate();
    });


  });
