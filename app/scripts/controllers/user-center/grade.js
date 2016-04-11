'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:GradeCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('GradeCtrl',function ($scope, $state, $rootScope, $stateParams, HongcaiUser) {
    $scope.page = 1;
    $scope.pageSize = 4;
    $scope.datas = [];
    $scope.totalPage = 1;
    $scope.useTotalPage = 1;
    $scope.unUseTotalPage = 1;

    $scope.initIndex = parseInt($stateParams.initIndex) || 0;
    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '体验金',
    }, {
      title: '加息券',
    }, {
      title: '邀请',
    }];
    
    $scope.subtabs = [{
      titles: '未使用',
    }, {
      titles: '已使用',
    }];

    $scope.investExperienceMoneyDeals = function(){
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/userInvestExperienceMoneyDeals').$then(function(response) {
        $scope.experienceDealStatis = response;
        $scope.investDeals = $scope.experienceDealStatis.investDeals;
      });
    };
    //体验金查询
    $scope.dealList = function(){
      if ($scope.totalPage < $scope.page){
        return;
      }
      var dealsReq = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/userInvestExperienceMoneyDeals', {
        page: $scope.page,
        pageSize: $scope.pageSize
      });
      dealsReq.$then(function(response){
        if(response.$status === 'ok'){
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.datas.push(response.data[i]);
          };
       } else{
            $scope.msg = '获取信息失败';
        }
      });
     //$scope.DealBusy = false;
    };

    //查询加息券
    $scope.couponList = function(subtabIndex){
      var totalPage = 0;
      if(subtabIndex === 0){
        totalPage = $scope.useTotalPage;
      }else if(subtabIndex === 1){
        totalPage = $scope.unUseTotalPage;
      }

      if (totalPage < $scope.page){
        return;
      }

      var status = "1";
      if(subtabIndex === 1){
        status = "2";
      }

      var couponsReq = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/userIncreaseRateCoupons', {
        page: $scope.page,
        pageSize: $scope.pageSize,
        status: status
      });
      couponsReq.$then(function(response){
        if(response.$status === 'ok'){
          if(subtabIndex === 0){
            $scope.useTotalPage = response.totalPage;
          }else if(subtabIndex === 1){
            $scope.unUseTotalPage = response.totalPage;
          }
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.datas.push(response.data[i]);
          };
          console.log($scope.datas);
       } else{
            $scope.msg = '获取信息失败';
        }
      });
     //$scope.DealBusy = false;
    };

    $scope.initData = function(tabIndex, subtabIndex){
      if(tabIndex === 0){
        $scope.dealList();
      }else if(tabIndex === 1){
        $scope.couponList(subtabIndex);
      }else if(tabIndex === 2){

      }
    };

    $scope.toggle.switchTab = function(tabIndex) {
      $scope.datas = [];
      $scope.toggle.activeTab = tabIndex;
      $scope.initData(tabIndex, 0);
      if($scope.tabs[tabIndex].title === '加息券'){
        $scope.toggle.activesubTab = 0;
      }
    };

    $scope.toggle.switchsubTab = function(subtabIndex) {
      $scope.datas = [];
      $scope.toggle.activesubTab = subtabIndex;
      $scope.initData(1, subtabIndex);
    };

    $scope.toggle.switchTab($scope.initIndex);

    $scope.loadMuch = function(tabIndex, subtabIndex){
      $scope.page = $scope.page + 1;
      $scope.totalPage = $scope.totalPage + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.initData(tabIndex, subtabIndex);
    };

  });

