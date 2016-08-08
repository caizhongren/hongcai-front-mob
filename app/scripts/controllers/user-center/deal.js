'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:DealCtrl
 * @description
 * # DealCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('DealCtrl', ['$rootScope', '$scope','$state', 'HongcaiUser', function($rootScope, $scope, $state,HongcaiUser) {
    $rootScope.selectedSide = 'account';
    $scope.page = 1;
    $scope.pageSize = 20;
    $scope.deals = [];
    $scope.totalPage = 1;
    // if ($rootScope.hasLoggedUser) {
    //   $scope.deals = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/deals', {
    //     page: $scope.page,
    //     pageSize: $scope.pageSize
    //   });
    //  // $scope.DealBusy = false;
    // }
    //自动加载更多
    //
    //
    //
    //
    $scope.dealList = function(){
      if ($scope.totalPage < $scope.page){
        return;
      }
      var dealsReq = HongcaiUser.$find('0' + '/deals', {
        page: $scope.page,
        pageSize: $scope.pageSize
      });
      dealsReq.$then(function(response){
        if(response.$status === 'ok'){
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.deals.push(response.data[i]);
          };
       } else{
            $scope.msg = '获取信息失败';
        }
      });
     //$scope.DealBusy = false;
    }

    // $scope.getDealList = function(){
    //   $scope.deals = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/deals', {
    //     page: $scope.page,
    //     pageSize: $scope.pageSize
    //   });
    //   $scope.deals.$then(function(response){
    //     if(response.$status === 'ok'){
    //       console.log(response);
    //         $scope.deals.data= response.data;
    //         console.log($scope.deals.data);
    //     } else{
    //         $scope.msg = '获取信息失败';
    //     }
    //   });
    //  //$scope.DealBusy = false;
    // }
    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      $scope.dealList();
    });



    $scope.loadDealMuch = function(){
      $scope.DealBusy = true;
      $scope.page = $scope.page + 1;
      $scope.totalPage = $scope.totalPage + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.dealList();
      $scope.DealBusy = false;
    };
    //以上为增加 自动加载代码

    // 通过点击加载更多宏金盈项目

    // $scope.loadDealMore = function() {
    //   $scope.pageSize = $scope.pageSize + 10;
    //   $scope.deals = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/deals', {
    //     page: $scope.page,
    //     pageSize: $scope.pageSize
    //   })
    // };


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
