'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', function($scope, $rootScope, $state, $stateParams, HongcaiUser, restmod, WEB_DEFAULT_DOMAIN) {
    $scope.tab = 0;
    $scope.widthFlag = "";
    $scope.screenWidth = function() {
      $scope.width = document.body.scrollWidth; //用系统返回宽度除以分辨率
      if ($scope.width >= 320 && $scope.width < 375) {
        $scope.widthFlag = 0;
      } else if ($scope.width >= 375 && $scope.width < 414) {
        $scope.widthFlag = 1;
      } else if ($scope.width >= 414) {
        $scope.widthFlag = 2;
      }
      return $scope.widthFlag;
    }
    $scope.screenWidth();

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


    HongcaiUser.$find(0 + '/totalProfit').$then(function(response) {
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
      siteCredits.$find('/getHeldInCreditRightList', {
        status: status,
        page: $scope.page,
        pageSize: $scope.pageSize
      }).$then(function(response) {
        $scope.totalPage = Math.ceil(response.data.count / $scope.page);
        var credits = response.data.heldIdCreditList;
        for (var i = 0; i <= credits.length - 1; i++) {
          if (credits[i].increaseRateCoupon) {
            var oriRate = credits[i].creditRight.riseRate + credits[i].creditRight.baseRate;
            credits[i].rateCouponProfit = credits[i].creditRight.profit * (credits[i].increaseRateCoupon.value + oriRate) / oriRate - credits[i].creditRight.profit;
          }

          $scope.credits.push(credits[i]);
        };
        $scope.loading = false;
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
