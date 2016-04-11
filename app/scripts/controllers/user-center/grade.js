'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:GradeCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('GradeCtrl',function ($scope, $state, $rootScope, $stateParams, $location, HongcaiUser) {
    $scope.page = 1;
    $scope.pageSize = 4;
    $scope.datas = [];
    $scope.totalPage = 1;

    $scope.tab = parseInt($stateParams.tab) || 0;
    $scope.subTab = $stateParams.subTab || 0;
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
      $location.search('tab', tabIndex);
    };

    $scope.toggle.switchsubTab = function(subtabIndex) {
      $scope.toggle.activesubTab = subtabIndex;
      console.log(subtabIndex);
    };

    $scope.toggle.switchTab($scope.tab);

    /**
     * 更多体验金使用记录
     */
    $scope.moreExperienceMoneyDeals = function(){
      if ($scope.totalPage < $scope.page){
        return;
      }
      var dealsReq = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/userInvestExperienceMoneyDeals', {
        page: $scope.page,
        pageSize: $scope.pageSize
      });
      dealsReq.$then(function(response){
        if(response.$status === 'ok' && response.ret !== -1){
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.datas.push(response.data[i]);
          };
       } else{
            $scope.msg = '获取信息失败';
        }
      });
    }


    /**
     * 更多邀请记录
     */
    $scope.moreInvites = function(){
      if ($scope.totalPage < $scope.page){
        return;
      }
      var dealsReq = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/inviteList', {
        page: $scope.page,
        pageSize: $scope.pageSize
      });
      dealsReq.$then(function(response){
        if(response.$status === 'ok' && response.ret !== -1){
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.datas.push(response.data[i]);
          };
       } else{
            $scope.msg = '获取信息失败';
        }
      });
    }

    $scope.toggle.activeTab = $scope.tab;
    if($scope.tabs[$scope.tab].title === '加息券'){
      $scope.toggle.switchsubTab(0);
    }

    $scope.loadMuch = function(){
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;

      $scope.moreExperienceMoneyDeals();
        
    };

    $scope.loadMoreInvites = function(){
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.moreInvites();
    }


    if($scope.tab == 0){
      $scope.moreExperienceMoneyDeals();
    } else if ($scope.tab == 2){
      $scope.moreInvites();
    }
    
    
  });

