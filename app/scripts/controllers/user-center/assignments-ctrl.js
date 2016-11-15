'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('assignmentsCtrl', function(config, Restangular, $scope, $rootScope, $state, $stateParams, HongcaiUser, restmod, WEB_DEFAULT_DOMAIN) {
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
      title: '可转让',
    }, {
      title: '转让中',
    }, {
      title: '已转让',
    }];

    $scope.page = 1;
    $scope.pageSize = 5;
    $scope.credits = [];

    /**
     * 切换标签
     */
    $scope.searchStatus = 1;
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.loading = true;

      // 与当前活动标签相同，不刷新数据
      if ($scope.toggle.activeTab === tabIndex) {
        return;
      }

      $scope.toggle.activeTab = tabIndex;
      if (tabIndex === 0) {
        $scope.searchStatus = '1';
        $scope.getAssignments(1);
      } else if(tabIndex === 1){
        $scope.searchStatus = '2';
        $scope.getTranferingAssignmentsList('1,2,5');
      }else {
        $scope.searchStatus = '3';
        $scope.getTranferingAssignmentsList('3,4');
      }
      $scope.credits = [];
      $scope.page = 1;
    };


    $scope.getAssignments = function(status) {
      Restangular.one('users').one('transferables').get({
        status: status,
        page: $scope.page,
        pageSize: $scope.pageSize
      }).then(function(response) {
        if (response && response.ret !== -1) {
          $scope.searchStatus = '1';
          $scope.transferablesList = response.transferables;
          $scope.transferableCounts = response.count;
          // 测试环境放开限制
          var currentDate = new Date().getTime();
          if(status === 1){
            for (var i = $scope.transferablesList.length - 1; i >= 0; i--) {
              $scope.transferablesList[i].canTransfer = config.isTest || (currentDate - $scope.transferablesList[i].createTime > 10*24*3600*1000);
            }
          }
          $scope.loading = false;
        } else {
        }
      });
    };

    /**
     * 获取转让中债权列表
     */
    $scope.getTranferingAssignmentsList = function(Status) {
      $scope.searchStatus = Status == '1,2,5' ? '2' : '3';
      Restangular.one('users', '0').one('assignments').get({
        page: $scope.page,
        pageSize: $scope.pageSize,
        status: Status
      }).then(function(response) {
        $scope.assignmentsList = [];
        if (response.data.length>0) {
          $scope.assignmentsList = response.data; 
          $scope.total = response.total; 
          $scope.loading = false;
        }
      });
    }

    $scope.toggle.switchTab(0);

    /**
     * 加载更多
     */
    $scope.loadAssignmentMore = function(status) {
      if (status == '1') {
        $scope.pageSize = $scope.transferableCounts-$scope.pageSize >5 ? $scope.transferableCounts-$scope.pageSize + 1 :$scope.transferableCounts;
        $scope.getAssignments(1);
      }else if (status == '2') {
        $scope.pageSize = $scope.transferableCounts-$scope.pageSize >5 ? $scope.transferableCounts-$scope.pageSize + 1 :$scope.transferableCounts;
        $scope.getTranferingAssignmentsList('1,2,5');
      }else if (status == '3') {
        $scope.pageSize = $scope.total-$scope.pageSize >5 ? $scope.total-$scope.pageSize + 1 :$scope.total;
        $scope.getTranferingAssignmentsList('3,4');
      }
      
      
    };


  });
