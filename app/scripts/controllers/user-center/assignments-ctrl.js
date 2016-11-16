'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:assignmentsCtrl
 * @description
 * # assignmentsCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('assignmentsCtrl', function(config, Restangular, $scope) {
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
    //暂不可转弹窗
    $scope.modalMsg = false;
    $scope.showRule = function(createTime){
      $scope.createTime = createTime;
      $scope.modalMsg = true;
    }
    $scope.closeRule = function() {
      $scope.modalMsg = false;
    }
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
        $scope.getTranferingAssignmentsList(1, '1,2,5');
      }else {
        $scope.searchStatus = '3';
        $scope.getTranferingAssignmentsList(1, '3,4');
      }
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
    $scope.page2 =1;
    $scope.page3 = 1
    $scope.getTranferingAssignmentsList = function(page, Status) {
      $scope.searchStatus = Status == '1,2,5' ? '2' : '3';
      Restangular.one('users', '0').one('assignments').get({
        page: page,
        pageSize: $scope.pageSize,
        status: Status
      }).then(function(response) {
        $scope.assignmentsList = page ==1 ? [] : $scope.assignmentsList;
        $scope.page2 = page ==1 ? 1 : $scope.page2;
        $scope.page3 = page ==1 ? 1 : $scope.page3;
        if (response.data.length>0) {
          for (var i = 0; i < response.data.length; i++) {
            $scope.assignmentsList.push(response.data[i]);
          };
          $scope.total = response.total; 
          $scope.index = response.index; 
          $scope.totalPage = response.totalPage; 
 
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
        $scope.page2 += 1;
        $scope.getTranferingAssignmentsList($scope.page2, '1,2,5');
      }else if (status == '3') {
        $scope.page3 = $scope.page3 + 1;
        $scope.getTranferingAssignmentsList($scope.page3, '3,4');
      }
      
      
    };


  });
