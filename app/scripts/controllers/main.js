'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', function($scope, $stateParams, $state, $rootScope, $location, $interval, Restangular, projects, fundsProjects, DateUtils) {
    // 宏金保列表页百分比值
    $scope.curr = 27;

    $scope.tabClassIndex = "";
    $scope.subtabClassIndex = "";
    $scope.widthFlag = "";

    $scope.page = 1;
    $scope.pageSize = 3;
    $scope.pageCount = 1;

    $scope.screenWidth = function(){
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

    $scope.jigoubaoData = [];
    $scope.getTempData = function() {
      if ($scope.pageCount < $scope.page || $scope.toggle.activeTab !== 1) {
        return;
      }
      Restangular.one('projects').get({
        page: $scope.page,
        pageSize: $scope.pageSize
      }).then(function(response) {
        $scope.jigoubao = response;
        $scope.baseFileUrl = response.baseFileUrl;
        // console.log(response);
        $scope.pageCount = response.pageCount;
        $scope.projectStatusMap = response.projectStatusMap;
        $scope.serverTime = response.serverTime || (new Date().getTime());
        for (var i = 0; i < response.projectList.length; i++) {
          response.projectList[i].countdown = new Date(response.projectList[i].releaseStartTime).getTime() - $scope.serverTime;
          response.projectList[i]._timeDown = DateUtils.toHourMinSeconds(response.projectList[i].countdown);
          $scope.jigoubaoData.push(response.projectList[i]);
        };

      });
    }

    $interval(function() {
      for (var i = $scope.jigoubaoData.length - 1; i >= 0; i--) {

        $scope.jigoubaoData[i].countdown -= 1000;
        if ($scope.jigoubaoData[i].countdown <= 0 && $scope.jigoubaoData[i].status === 6) {
          $scope.jigoubaoData[i].status = 7;
        }

        $scope.jigoubaoData[i]._timeDown = DateUtils.toHourMinSeconds($scope.jigoubaoData[i].countdown);
      };
    }, 1000);

    $scope.loadDealMuch = function() {
      $scope.DealBusy = true;
      $scope.getTempData();
      $scope.page = $scope.page + 1;
      $scope.pageCount = $scope.pageCount + 1;
      $scope.pageSize = $scope.pageSize;

      $scope.DealBusy = false;
    };

    $scope.goProjectInvest = function(project) {
      if ($scope.jigoubaoData.currentStock <= 0 || $scope.jigoubaoData.status !== 1) {
        $state.go('root.project-detail', {
          number: project.number
        });
        return;
      }

      if (!$rootScope.isLogged) {
        $location.path('/login');
        return;
      }

      if ($rootScope.securityStatus.realNameAuthStatus !== 1) {
        if (confirm('您还未开通托管账户，请到个人中心开通')) {
          $state.go('root.userCenter.account');
        }
        return;
      }

      $state.go('root.project-detail', {
        number: $scope.jigoubaoData.number
      })
    }
    $scope.switchFundsProjects = function(type) {
      fundsProjects.$find('recommendations', {
        productType: type
      }).$then(function(response) {
        if (response.$status === 'ok') {
          $scope.recFundsProjects = response;
          // 可投资金额
          $scope.recFundsProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
          $scope.stepShowMsg = '每7日';
          // switch (type) {
          //   case 1:
          //     $scope.stepShowMsg = '每7日';
          //     break;
          //   case 2:
          //     $scope.stepShowMsg = '每月';
          //     break;
          //   case 3:
          //     $scope.stepShowMsg = '每季度';
          //     break;
          //   case 4:
          //     $scope.stepShowMsg = '每半年';
          //     break;
          // }
        } else {
          // 访问接口失败；
        }
      });
    };
    // tab 零存宝  宏金盈 宏金保暂时不做
    $scope.toggle = {};
    $scope.tabs = [{
      title: '零存宝',
    }, {
      title: '宏金保'
    }];

    $scope.subTabs = [{
      title: '月月盈',
    }, {
      title: '季度盈',
    }, {
      title: '半年盈',
    }];

    $scope.subTabTitle = [{
      title: '月月盈',
    }, {
      title: '季度盈',
    }, {
      title: '半年盈',
    }];

    // 默认调用七日盈。
    // $scope.switchFundsProjects(1);

    // 查看详情 通过activeTab判断  值为0 是零存宝 ;值为1  是宏金盈; 值为2  是宏金保;
    $scope.goDetail = function(project) {
      if ($scope.toggle.activeTab === 0) {
        $state.go('root.current-deposit-detail', {
          number: project.number
        });
      }
      // else if ($scope.toggle.activeTab === 1) {
      //   $state.go('root.investmentplan-details', {
      //     number: project.number
      //   });
      // } else if ($scope.toggle.activeTab === 2) {
      //   $state.go('root.project-detail', {
      //     number: project.number
      //   });
      // }
    }

    $scope.toggle.switchTab = function(tabIndex) {
      $location.search({tab: tabIndex});

      // $scope.toggle.activeTab = tabIndex;
      // $rootScope.tab=$scope.toggle.activeTab;

      // if (tabIndex !== 1) {
      //   $scope.switchFundsProjects(1);
      // }
      //初始化第二层Tab数据
      // tabIndex === 1 ? $scope.toggle.switchSubTab(1) : '';
      // $scope.tabClassIndex = $scope.toggle.activeTab;
    };

    $scope.toggle.switch = function(tabIndex, subTab) {
      $location.search({
        tab: tabIndex,
        subTab: subTab
      });
    };

    // $scope.toggle.switchSubTab = function(subTabIndex) {
    //   var subType = subTabIndex;
    //   if($scope.subTabTitle[subTabIndex].title === '月月盈'){
    //     subType = 2;
    //     $scope.subTabTitle = [];
    //     $scope.subTabTitle = [{
    //       title: '',
    //     }, {
    //       title: '月月盈',
    //     }, {
    //       title: '季度盈',
    //     }];
    //   }else if($scope.subTabTitle[subTabIndex].title === '季度盈'){
    //     subType = 3;
    //     $scope.subTabTitle = [];
    //     $scope.subTabTitle = [{
    //       title: '月月盈',
    //     }, {
    //       title: '季度盈',
    //     }, {
    //       title: '半年盈',
    //     }];
    //   }else if($scope.subTabTitle[subTabIndex].title === '半年盈'){
    //     subType = 4;
    //     $scope.subTabTitle = [];
    //     $scope.subTabTitle = [{
    //       title: '季度盈',
    //     }, {
    //       title: '半年盈',
    //     }, {
    //       title: '',
    //     }];
    //   }

    //   if (subTabIndex < 0 || subTabIndex > 2) {
    //     return;
    //   }

    //   $scope.toggle.activeSubTab = subTabIndex;
    //   $scope.switchFundsProjects(subType);
    //   $scope.subtabClassIndex = subTabIndex;

    //   // console.log(subType);
    //   $rootScope.subtab=subType-2;
    //   var subtab=$rootScope.subtab;
    //   if ($rootScope.tab === 1) {
    //     $state.go('root.main', {
    //       tab: 1,
    //       subTab:subtab
    //     });
    //   }

    //   // console.log($scope.subtabClassIndex);
    // };
    
    $scope.toggle.activeTab = 1;
    $scope.toggle.activeSubTab = 0;
    if($stateParams.tab){
      $scope.toggle.activeTab = parseInt($stateParams.tab);
    } 
    if($stateParams.subTab){
      $scope.toggle.activeSubTab = parseInt($stateParams.subTab);
    }



    if($scope.toggle.activeTab == 0){
      $scope.switchFundsProjects(1);
    }

    // $scope.toggle.switch(+$scope.tab, +$scope.subTab);

    // 判断是否有参数，有参数执行if中。没有参数执行else中。
    // if (window.location.search) {
    //   $scope.toggle.switch(+$scope.tab, +$scope.subTab);
    // } else {
    //   $scope.switchFundsProjects(1);
    // }

    /**
     * 点击立即投资
     */
    $scope.goInvest = function() {
      if ($scope.recFundsProjects.currentStock <= 0 || $scope.recFundsProjects.status !== 1) {
        $scope.goDetail($scope.recFundsProjects);
        return;
      }

      if (!$rootScope.isLogged) {
        $location.path('/login');
        return;
      }

      if ($rootScope.securityStatus.realNameAuthStatus !== 1) {
        if (confirm('您还未开通托管账户，请到个人中心开通')) {
          $state.go('root.userCenter.account');
        }
        return;
      }

      $state.go('root.invplan-verify', {
        number: $scope.recFundsProjects.number
      })
    }

  });
