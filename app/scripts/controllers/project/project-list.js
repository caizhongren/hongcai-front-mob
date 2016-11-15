'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectListCtrl
 * @description
 * # ProjectListCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectListCtrl', function($scope, $rootScope, $state, $timeout, $stateParams, $location, Restangular, ProjectUtils, ScreenWidthUtil){
  	$scope.page = 1;
    $scope.pageSize = 5;
  	$scope.widthFlag = "";
  	$scope.jigoubaoData = [];
    $scope.assignments = [];
    //限制项目名长度
  	$scope.widthFlag = ScreenWidthUtil.screenWidth();
    $scope.tabs = [{
        title: '宏金保',
      }, {
        title: '债权转让',
      }];
    // $scope.toggle = {};
    $scope.activeTab = 0;
    $scope.tabParam = $stateParams.tab == undefined ? '0' : $stateParams.tab;
    $scope.switchTab = function(tabIndex) {
      $stateParams.tab = tabIndex;
      // console.log($stateParams.tab);
      $scope.activeTab = tabIndex;
      $location.search('tab', tabIndex);
    };
    
    /**
     * 当前页项目列表
     */
    $scope.getProjectList = function(page, pageSize) {
      $scope.busy = true;

      if ($scope.pageCount < $scope.page) {
        return;
      }
      Restangular.one('projects').get({
        page: page,
        pageSize: pageSize
      }).then(function(response) {
        $scope.pageCount = response.pageCount;
        $scope.projectStatusMap = response.projectStatusMap;

        var serverTime = response.serverTime || (new Date().getTime());
        for (var i = 0; i < response.projectList.length; i++) {
          ProjectUtils.projectTimedown(response.projectList[i], serverTime);
          $scope.jigoubaoData.push(response.projectList[i]);
        };

        $timeout(function() {
          $scope.busy = false;
        }, 100);

      });
    }
    /**
    *债权转让列表
    */
    $scope.getAssignmentList = function(page, pageSize) {
      $scope.busy = true;
      Restangular.one("assignments").get({
        page: page,
        pageSize: pageSize
      }).then(function(response){
        if(response && response.ret !== -1) {
          // $scope.assignments =  response.assignments;
          $scope.pageCount0 = response.pageCount;
           for (var i = 0; i < response.assignments.length; i++) {
            // ProjectUtils.projectTimedown(response.projectList[i], serverTime);
            $scope.assignments.push(response.assignments[i]);
          };
          $timeout(function() {
            $scope.busy = false;
          }, 100);
        }
      })
    }
    $scope.getAssignmentList($scope.page, $scope.pageSize);
    /**
     * 跳转到详情页
     */
    $scope.toDetail = function(project){
      if($rootScope.timeout){
        $state.go('root.project', {number: project.number});
      }
    }

    $scope.getProjectList($scope.page, $scope.pageSize);

    /**
     * 加载更多项目
     */
    $scope.loadMore = function(project) {
      if($scope.busy){
        return;
      }
      $scope.busy = true;
      $scope.page = $scope.page + 1;
      project($scope.page, $scope.pageSize);
    };

  })

