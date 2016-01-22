'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:FundsProjectDetailCtrl
 * @description
 * # FundsProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectDetailCtrl', function($scope, $state, $rootScope, $stateParams,fundsProjects, Restangular, restmod, DEFAULT_DOMAIN, config) {
    // 宏金盈详情页面
    // var number = $stateParams.number;
    if (!$stateParams.number) {
      $state.go('root.main');
    }

    Restangular.one('projects').one($stateParams.number).get().then(function(response) {
      $scope.jigoubaoDetailData = response;
      $scope.jigoubaoDataMore = $scope.jigoubaoDetailData.projectInfo;
      console.log($scope.jigoubaoDetailData);
      $scope.jigoubaoProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
      // 当status===1可融资状态的时候，判断fundsFlag的状态。0：未登录，1：普通用户，2：实名用户，3：开启自动投资用户。
      if ($scope.jigoubaoDetailData.status === 7) {
        if ($rootScope.account) {
          // 用户可投资金额
          var plusNum = $rootScope.securityStatus.realNameAuthStatus;
          console.log(plusNum);
          switch (plusNum) {
            case 1:
              $scope.fundsFlag = 2;
              break;
            case 0:
              $scope.fundsFlag = 1;
              break;
          }
        } else {
          $scope.userCanCreditInvestNum = 0;
          $scope.fundsFlag = 0;
        }
      }
      if (!$rootScope.hasLoggedUser || !$rootScope.hasLoggedUser.id) {
        return;
      }
    });
    
    $scope.goMoreDetail = function(project){
      $state.go('root.project-detail-more', {
        number:project.number
      });
    }
    $scope.checkLargeUserCanAmount = function(project) {
      if ($rootScope.account) {
        var availableAmount = project.status !== 7 ? $rootScope.account.balance : $rootScope.account.balance + $rootScope.account.experienceAmount;
        if ($rootScope.account.balance < project.investAmount) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };
    $scope.checkStepAmount = function(project) {
      if (project.investAmount >= project.increaseAmount) {
        if (project.investAmount % project.increaseAmount === 0) {
          return false;
        } else {
          return true;
        }
      }
    };

    $scope.checkAutoTransfer = function(jigoubaoDetailData) {
      $scope.project.isRepeatFlag = !$scope.project.isRepeatFlag;

      // alert('点击自动续投');
      if ($scope.fundsFlag !== 3) {
        $scope.jigoubaoDetailData.isRepeatFlag = false;
        jigoubaoDetailData.isRepeatFlag = false;
        $scope.authAutoTransferFlag = true;
        $scope.msg = "您还没有开通自动续投";
      }
    };

    $scope.cancelAuthAutoTransfer = function() {
      $scope.authAutoTransferFlag = false;
    }

    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function() {
      $state.go('root.yeepay-transfer', {
        type: 'autoTransfer',
        number: "null"
      });
    }

  });
