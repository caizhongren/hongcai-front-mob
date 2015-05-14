'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:FundsProjectDetailCtrl
 * @description
 * # FundsProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('FundsProjectDetailCtrl', ['$scope', '$state', '$stateParams', 'fundsProjects', function($scope, $state, $stateParams, fundsProjects) {
    // 宏金盈详情页面
    var number = $stateParams.number;
    if (!number) {
      $state.go('root.project-list');
    }
    // simple project
    fundsProjects.$find(number).$then(function(response) {
      if (response.$status === 'ok') {
        // 项目详情
        $scope.simpleFundsProject = response;
        // 可投资金额
        $scope.fundsProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
        // 当status===1可融资状态的时候，判断invPlanFlag的状态。0：未登录，1：普通用户，2：实名用户，3：开启自动投资用户。
        if ($scope.simpleFundsProject.status === 1) {
          if ($rootScope.account) {
            // 用户可投资金额
            $scope.userCanFundsInvestNum = $scope.fundsProjectInvestNum > $rootScope.account.balance ? $rootScope.account.balance : $scope.fundsProjectInvestNum;

            var plusNum = $rootScope.securityStatus.realNameAuthStatus + $rootScope.securityStatus.autoTransfer;
            switch (plusNum) {
              case 2:
                $scope.fundsFlag = 3;
                break;
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
      } else {
        // do anything?
        // 请求数据失败，请重新加载该页面
      }
    });

    $scope.statusMap = {
      1: '融资中',
      2: '融资成功',
      3: '融资结束',
      4: '还款中',
      5: '还款完成'
    };

    $scope.toInvest = function(simpleFundsProject) {
      // if (simpleFundsProject.isRepeatFlag && $scope.invPlanFlag === 3) {
      //   $scope.isRepeat = 1;
      // } else {
      //   $scope.isRepeat = 2;
      // }
      // $scope.invPlanAmount = simpleFundsProject.invPlanAmount;
      // if ($scope.invPlanFlag === 0) {
      //   $scope.toRealLogin();
      // } else if ($scope.invPlanFlag === 1) {
      //   $scope.toRealNameAuth();
      //   // 跳到实名认证页面
      // } else if ($scope.checkLargeUserCanAmount(simpleFundsProject)) {
      //   $scope.toRecharge();
      // } else if ($scope.invPlanFlag === 2 || $scope.invPlanFlag === 3) {
      //   ProjectService.isFundsAvailableInvest.get({
      //     amount: simpleFundsProject.invPlanAmount,
      //     projectId: simpleFundsProject.id,
      //     isRepeat: $scope.isRepeat
      //   }, function(response) {
      //     if (response.ret === 1) {
      //       $state.go('root.invplan-verify', {
      //         projectId: response.data.projectId,
      //         amount: response.data.amount,
      //         isRepeat: response.data.isRepeat
      //       });
      //     } else {
      //       if (response.code === -1027) {
      //         $scope.msg = '抱歉，已经卖光了。';
      //         $modal({
      //           scope: $scope,
      //           template: 'views/modal/alert-dialog.html',
      //           show: true
      //         });
      //       } else {
      //         $scope.msg = response.msg;
      //         $modal({
      //           scope: $scope,
      //           template: 'views/modal/alert-dialog.html',
      //           show: true
      //         });
      //       }
      //     }
      //   });
      // }
    };

  }]);
