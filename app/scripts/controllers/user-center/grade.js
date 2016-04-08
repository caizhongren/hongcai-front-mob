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

    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
      if($scope.tabs[tabIndex].title === '加息券'){
        $scope.toggle.switchsubTab(0);
      }
    };

    $scope.toggle.switchsubTab = function(subtabIndex) {
      $scope.toggle.activesubTab = subtabIndex;
      console.log(subtabIndex);
    };

    $scope.toggle.switchTab($scope.initIndex);

    $scope.investExperienceMoneyDeals = function(){
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/userInvestExperienceMoneyDeals').$then(function(response) {
        $scope.experienceDealStatis = response;
        $scope.investDeals = $scope.experienceDealStatis.investDeals;
      });
    }

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
    }

    $scope.DealBusy = false;
    $scope.loadMuch = function(){
      $scope.DealBusy = true;
      $scope.page = $scope.page + 1;
      $scope.totalPage = $scope.totalPage + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.dealList();
      $scope.DealBusy = false;
    };

    $scope.dealList();
  });

