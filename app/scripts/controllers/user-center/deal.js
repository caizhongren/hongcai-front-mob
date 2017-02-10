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
    $scope.pageSize = 10;
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
    $rootScope.showLoadingToast = true;
    $scope.dealList = function(types){
      $rootScope.showLoadingToast = true;
      if ($scope.totalPage < $scope.page){
        return;
      }
      var dealsReq = HongcaiUser.$find('0' + '/deals', {
        page: $scope.page,
        pageSize: $scope.pageSize,
        types: types
      });
      dealsReq.$then(function(response){
        if(response.$status === 'ok'){
          $scope.dealDate = response;
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.deals.push(response.data[i]);
          };
          $rootScope.showLoadingToast = false;
       } else{
          $scope.msg = '获取信息失败';
          $rootScope.showLoadingToast = true;
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



    $scope.loadDealMuch = function(dealNo){
      $scope.DealBusy = true;
      $scope.page = $scope.page + 1;
      $scope.totalPage = $scope.totalPage + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.dealList(dealNo);
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
      18: '奖金',
      19: '提前赎回',
      20: '代理人绩效',
      21: '愿望达成',
      22: '星愿币兑换',
      23: '提现打款失败',
      24: '补偿'
    };

    $scope.showSelect = false;
    $scope.selected = '全部';
    $scope.dealType = [
      {
        'type': '全部',
        'no': ''
      },{
        'type': '充值',
        'no': '1'
      },{
        'type': '投资',
        'no': '3'
      },{
        'type': '回款',  //包含：项目正常回款、债权转让回款
        'no': '4,16'
      },{
        'type': '提现',  
        'no': '2'
      },{
        'type': '奖励',  //包含：奖金、代理人绩效
        'no': '18,20'
      },{
        'type': '其他',  //包含：提现手续费、债权转让手续费
        'no': '8,15'
      }
    ]
    //下拉菜单
    $scope.select =function(){
      $scope.showSelect = !$scope.showSelect;
      if($scope.showSelect){ //出现下拉选择 隐藏footer
        $rootScope.showFooter = false;
      }else {
        $rootScope.showFooter = true;
      }
    }
    //选择资金流水类型
    $scope.selectDealType = function(dealType){
      $scope.selected = dealType.type;
      $scope.dealNo = dealType.no;
      $scope.deals = [];
      $scope.page = 1;
      $scope.totalPage = 1;
      $scope.select();
      $scope.dealList(dealType.no);
    }
    
  }]);
