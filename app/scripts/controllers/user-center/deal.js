'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:DealCtrl
 * @description
 * # DealCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('DealCtrl', ['$rootScope', '$scope', 'HongcaiUser', function($rootScope, $scope, HongcaiUser) {
    $rootScope.selectedSide = 'account';
    $scope.page = 1;
    $scope.pageSize = 10;
    if ($rootScope.hasLoggedUser) {
      $scope.deals = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/deals', {
        page: $scope.page,
        pageSize: $scope.pageSize
      });
    }
    // 加载更多宏金盈项目
    $scope.loadDealMore = function() {
      $scope.pageSize = $scope.pageSize + 10;
      $scope.deals = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/deals', {
        page: $scope.page,
        pageSize: $scope.pageSize
      });
    };

    $scope.dealMap = {
      1: '充值',
      2: '提现',
      3: '投资',
      4: '回款',
      5: '项目流标',
      6: '放款',
      7: '还款',
      8: '提现手续费',
      9: '充值手续费',
      10: '活期利息',
      11: '预约期利息',
      12: '预约',
      13: '取消预约',
      14: '咨询服务费',
      15: '债权转让服务费',
      16: '债权转让回款',
      17: '宏金盈转账',
      18: '奖金'
    };
  }]);
