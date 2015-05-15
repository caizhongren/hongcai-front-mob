'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:FundsProjectDetailCtrl
 * @description
 * # FundsProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('FundsProjectDetailCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'fundsProjects', 'orders', 'restmod', 'DEFAULT_DOMAIN', function($scope, $state, $rootScope, $stateParams, fundsProjects, orders, restmod, DEFAULT_DOMAIN) {
    // 宏金盈详情页面
    var number = $stateParams.number;
    if (!number) {
      $state.go('root.main');
    }
    // simple project
    fundsProjects.$find(number).$then(function(response) {
      if (response.$status === 'ok') {
        // 项目详情
        $scope.simpleFundsProject = response;
        // 可投资金额
        $scope.fundsProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
        // 当status===1可融资状态的时候，判断fundsFlag的状态。0：未登录，1：普通用户，2：实名用户，3：开启自动投资用户。
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
    $scope.checkLargeUserCanAmount = function(simpleFundsProject) {
      if ($rootScope.account) {
        if ($rootScope.account.balance < simpleFundsProject.investAmount) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    };

    $scope.checkStepAmount = function(simpleFundsProject) {
      if (simpleFundsProject.investAmount >= simpleFundsProject.increaseAmount) {
        if (simpleFundsProject.investAmount % simpleFundsProject.increaseAmount === 0) {
          return false;
        } else {
          return true;
        }
      }
    };

    $scope.checkAutoTransfer = function(simpleFundsProject) {
      if ($scope.fundsFlag !== 3) {
        $scope.simpleFundsProject.isRepeatFlag = false;
        simpleFundsProject.isRepeatFlag = false;
        $scope.msg = "您还没有开通自动续投";
      }
    };

    $scope.toInvest = function(simpleFundsProject) {
      if (simpleFundsProject.isRepeatFlag && $scope.fundsFlag === 3) {
        $scope.isRepeat = 1;
      } else {
        $scope.isRepeat = 2;
      }
      $scope.investAmount = simpleFundsProject.investAmount;
      if ($scope.fundsFlag === 0) {
        $state.go('root.login');
      } else if ($scope.fundsFlag === 1) {
        // 需要跳动实名认证页面
      } else if ($scope.checkLargeUserCanAmount(simpleFundsProject)) {
        $state.go('root.user-center.recharge');
      } else if ($scope.fundsFlag === 2 || $scope.fundsFlag === 3) {
        // console.log($rootScope.hasLoggedUser);
        // how to bulid investment path restmod.model
        // restmod.model(DEFAULT_DOMAIN + '/projects')
        restmod.model(DEFAULT_DOMAIN + '/fundsProjects/' + number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
        // fundsProjects.$find(number + '/users/' + $rootScope.hasLoggedUser.id + '/investment').$create({
          amount: simpleFundsProject.investAmount,
          projectId: simpleFundsProject.id,
          isRepeat: $scope.isRepeat
        }).$then(function(response) {
          console.log(response);
          // 重复下单后，response.number为undefined
          if (response.$status === 'ok' && response.number !== null && response.number !== undefined) {
            restmod.model(DEFAULT_DOMAIN + '/orders/' + response.number + '/users/' + $rootScope.hasLoggedUser.id + '/payment').$create().$then(function(response) {
              console.log('订单成功');
              // $state.go('');
            })
          }
        })
      }
      //   ProjectService.isFundsAvailableInvest.get({
      //     amount: simpleFundsProject.investAmount,
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
