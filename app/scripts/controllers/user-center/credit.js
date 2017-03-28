'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', function($timeout, $scope, $rootScope, $state, $location, $stateParams, HongcaiUser, restmod, WEB_DEFAULT_DOMAIN, ScreenWidthUtil, Restangular) {

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      var title = '我的投资';
      if (toState.data && toState.data.title) {
        title = toState.data.title;
      }else if($stateParams.tab === '0'){
        title = '我的投资—宏财精选';       
      } else if ($stateParams.tab === '1') {
        title = '我的投资—宏财尊贵'; 
      } else if ($stateParams.tab === '2') {
        title = '我的投资—债权转让'; 
      } else if ($stateParams.tab === '3') {
        title = '我的投资—其他'; 
      }
      console.log(title);
    })
    $scope.tab = 0;
    $scope.widthFlag = ScreenWidthUtil.screenWidth();
    $rootScope.showLoadingToast = true;

    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '持有中',
    }, {
      title: '已结清',
    }];

    $rootScope.selectedSide = 'investments-stat';
    $scope.page = 1;
    $scope.pageSize = 5;
    //$scope.creditsDetail = [];
    $scope.credits = [];


    // HongcaiUser.$find(0 + '/totalProfit').$then(function(response) {
    //   if (response.ret !== -1) {
    //     $scope.totalProfit = response;
    //   }
    // });

    /**
     * 切换标签
     */
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.loading = true;

      // 与当前活动标签相同，不刷新数据
      if ($scope.toggle.activeTab === tabIndex) {
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

    //统计持有、已回款项目数量
    siteCredits.$find('/getCreditRightStatistics', {}).$then(function(response) {
      $scope.creditRightStatis = response.data.creditRightStatis;
      $scope.heldingCount = $scope.creditRightStatis.heldingCount;
      $scope.endProfitCount = $scope.creditRightStatis.endProfitCount;
    });

    $scope.getCredits = function(status) {
      $rootScope.showLoadingToast = true;
      siteCredits.$find('/getHeldInCreditRightList', {
        status: status,
        page: $scope.page,
        pageSize: $scope.pageSize
      }).$then(function(response) {
        $scope.totalPage = Math.ceil(response.data.count / $scope.pageSize);
        $scope.creditsData = response.data.heldIdCreditList;
        for (var i = 0; i <= $scope.creditsData.length - 1; i++) {
          if ($scope.creditsData[i].increaseRateCoupon) {
            var oriRate = $scope.creditsData[i].creditRight.riseRate + $scope.creditsData[i].creditRight.baseRate;
            $scope.creditsData[i].rateCouponProfit = $scope.creditsData[i].creditRight.profit * ($scope.creditsData[i].increaseRateCoupon.value + oriRate) / oriRate - $scope.creditsData[i].creditRight.profit;
          }

          $scope.credits.push($scope.creditsData[i]);
        };
        $scope.loading = false;
        $timeout(function() {
          $rootScope.showLoadingToast = false;
        }, 200);
        
      })

    
    };

    $scope.toggle.switchTab(0);
    //跳转详情页
    $scope.goDtail = function(item) {
      if(item == 3) {
        return;
      }
      $state.go('root.userCenter.credit-security-details',{type: 1,number:item});
    }
    /**
     * 加载更多
     */
    $scope.loadCreditMore = function() {
      $scope.page = $scope.page + 1;
      $scope.getCredits($scope.creditStatus);
    };


  });
