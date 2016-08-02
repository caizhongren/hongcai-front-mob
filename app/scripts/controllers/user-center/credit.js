'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', function($scope, $rootScope, $state, HongcaiUser, restmod, WEB_DEFAULT_DOMAIN) {

    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '持有中',
    }, {
      title: '已回款',
    }];

    $rootScope.selectedSide = 'investments-stat';
    $scope.page = 1;
    $scope.pageSize = 5;
    //$scope.creditsDetail = [];
    $scope.credits = [];

    
    HongcaiUser.$find(0 + '/totalProfit').$then(function(response){
      if (response.ret !== -1) {
        $scope.totalProfit = response;
      }
    });

    /**
     * 切换标签
     */
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.loading = true;

      // 与当前活动标签相同，不刷新数据
      if($scope.toggle.activeTab === tabIndex){
        return;
      }

      $scope.toggle.activeTab = tabIndex;
      if (tabIndex === 0) {
        $scope.creditStatus = '1';
      } else {
        $scope.creditStatus = '4';
      }
      $scope.credits = [];
      $scope.page = 1;
      $scope.getCredits($scope.creditStatus);
      //$scope.getCreditList($scope.creditStatus);
    };

    
    


    var siteCredits = restmod.model(WEB_DEFAULT_DOMAIN + '/siteCredit');
    $scope.getCredits = function(status) {
      siteCredits.$find('/getHeldInCreditRightList', {
        status: status,
        page: $scope.page,
        pageSize: $scope.pageSize
      }).$then(function(response){
        $scope.totalPage = Math.ceil(response.data.count/$scope.page);
        var credits = response.data.heldIdCreditList;
        for (var i = 0; i <= credits.length - 1; i++) {
          if(credits[i].increaseRateCoupon){
            var oriRate = credits[i].creditRight.riseRate + credits[i].creditRight.baseRate;
            credits[i].waitRateCouponProfit = credits[i].creditRight.profit * (credits[i].increaseRateCoupon.rate + oriRate)/oriRate - credits[i].creditRight.profit;
            credits[i].returnRateCouponProfit = credits[i].creditRight.returnProfit * (credits[i].increaseRateCoupon.rate + oriRate)/oriRate - credits[i].creditRight.returnProfit;

          }
          
          $scope.credits.push(credits[i]);
        };
        $scope.loading = false;
      })

        // $scope.creditStatus = status;
        // HongcaiUser.$find($rootScope.hasLoggedUser.id + '/credits', {
        //   status: $scope.creditStatus,
        //   page: $scope.page,
        //   pageSize: $scope.pageSize
        // }).$then(function(response){
        //   $scope.totalPage = response.totalPage;
        //   var credits = response.data;
        //   for (var i = 0; i <= credits.length - 1; i++) {
        //     $scope.credits.push(credits[i]);
        //   };
        // });
    };

    $scope.toggle.switchTab(0);

    /**
     * 加载更多
     */
    $scope.loadCreditMore = function() {
      $scope.page = $scope.page + 1;
      $scope.getCredits($scope.creditStatus);
    };

    
  });
