'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl', function($scope, $stateParams, $state, $rootScope, $location, Restangular, projects, fundsProjects) {
    // 宏金保列表页百分比值

    $scope.curr = 27;

    $scope.tabClassIndex = "";
    $scope.subtabClassIndex = "";
    $scope.page = 1;
    $scope.pageSize = 5;

    // 获取宏金宝投资列表
    // $scope.projectsRecommendations = projects.$find('recommendations');
    // 获取宏金盈投资列表
    Restangular.one('projects').get({
      page: $scope.page,
      pageSize: $scope.pageSize
    }).then(function(response) {
      $scope.jigoubao = response;
      $scope.jigoubaoData = response.projectList;
      // console.log($scope.jigoubaoData);
    });
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
          $state.go('root.user-center.account');
        }
        return;
      }

      $state.go('root.project-detail', {
        number: $scope.jigoubaoData.number
      })
    }
    $scope.switchFundsProjects = function(type) {
      // console.log(type);
      fundsProjects.$find('recommendations', {
        productType: type
      }).$then(function(response) {
        if (response.$status === 'ok') {
          $scope.recFundsProjects = response;
          // 可投资金额
          $scope.recFundsProjectInvestNum = response.total - (response.soldStock + response.occupancyStock) * response.increaseAmount;
          switch (type) {
            case 1:
              $scope.stepShowMsg = '每7日';
              break;
            case 2:
              $scope.stepShowMsg = '每月';
              break;
            case 3:
              $scope.stepShowMsg = '每季度';
              break;
            case 4:
              $scope.stepShowMsg = '每半年';
              break;
          }
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
      title: '宏金盈'
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
      } else if ($scope.toggle.activeTab === 1) {
        $state.go('root.funds-project-detail', {
          number: project.number
        });
      } else if ($scope.toggle.activeTab === 2) {
        $state.go('root.project-detail', {
          number: project.number
        });
      }
    }

    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
      // console.log($scope.toggle.activeTab);
      var type = tabIndex + 1;
      if (tabIndex !== 1) {
        $scope.switchFundsProjects(type);
      }
      //初始化第二层Tab数据
      tabIndex === 1 ? $scope.toggle.switchSubTab(1) : '';
      $scope.tabClassIndex = $scope.toggle.activeTab;
      // console.info($scope.tabClassIndex);
    };

    $scope.toggle.switch = function(tabIndex, subTab) {
      $scope.toggle.activeTab = tabIndex;
      if (tabIndex !== 1) {
        $scope.switchFundsProjects(1);
      } else {
        if (subTab < 0 || subTab > 2) {
          return;
        }
        var subType = subTab + 2;
        $scope.switchFundsProjects(subType);
        $scope.tabClassIndex = 1;
        $scope.toggle.activeSubTab = subTab;
        $scope.subtabClassIndex = subTab;
        if (subTab === 0) {
          $scope.subTabTitle = [];
          $scope.subTabTitle = [{
            title: '',
          }, {
            title: '月月盈',
          }, {
            title: '季度盈',
          }];
        } else if (subTab === 1) {
          $scope.subTabTitle = [];

          $scope.subTabTitle = [{
            title: '月月盈',
          }, {
            title: '季度盈',
          }, {
            title: '半年盈',
          }];
        } else if (subTab === 2) {
          $scope.subTabTitle = [];
          $scope.subTabTitle = [{
            title: '季度盈',
          }, {
            title: '半年盈',
          }, {
            title: '',
          }];
        }

        //初始化第二层Tab数据
        // $scope.toggle.switchSubTab(subTab);

      }

    };

    $scope.toggle.switchSubTab = function(subTabIndex) {
      if (subTabIndex === 0) {
        $scope.subTabTitle = [];
        $scope.subTabTitle = [{
          title: '',
        }, {
          title: '月月盈',
        }, {
          title: '季度盈',
        }];
        // console.log($scope.subTabTitle);
      } else if (subTabIndex === 1) {
        $scope.subTabTitle = [];

        $scope.subTabTitle = [{
          title: '月月盈',
        }, {
          title: '季度盈',
        }, {
          title: '半年盈',
        }];
        // console.log($scope.subTabTitle);
      } else if (subTabIndex === 2) {
        $scope.subTabTitle = [];
        $scope.subTabTitle = [{
          title: '季度盈',
        }, {
          title: '半年盈',
        }, {
          title: '',
        }];
        // console.log($scope.subTabTitle);
      }

      if (subTabIndex < 0 || subTabIndex > 2) {
        return;
      }

      $scope.toggle.activeSubTab = subTabIndex;
      var subType = subTabIndex + 2;
      $scope.switchFundsProjects(subType);
      $scope.subtabClassIndex = subTabIndex;


      // console.log($scope.subtabClassIndex);
    };


    $scope.tab = $stateParams.tab || 0;
    $scope.subTab = $stateParams.subTab || 0;
    $scope.toggle.switch(+$scope.tab, +$scope.subTab);

    // 判断是否有参数，有参数执行if中。没有参数执行else中。
    if (window.location.search) {
      $scope.toggle.switch(+$scope.tab, +$scope.subTab);
    } else {
      $scope.switchFundsProjects(1);
    }

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
          $state.go('root.user-center.account');
        }
        return;
      }

      $state.go('root.investment-confirmation', {
        number: $scope.recFundsProjects.number
      })
    }

  });
