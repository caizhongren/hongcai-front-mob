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
  	$scope.projectDatas = [];
    $scope.assignments = [];
    $rootScope.showLoadingToast = true;
    //限制项目名长度
  	$scope.widthFlag = ScreenWidthUtil.screenWidth();
    $scope.tabs = [{
        title: '宏财精选',
      },{
        title: '宏财尊贵',
      },{
        title: '债权转让',
    }];

    /**
     * 当前页项目列表
     */
    $scope.getProjectList = function(page, pageSize, type) {
      $rootScope.showLoadingToast = true;
      $scope.busy = true;

      if ($scope.pageCount < $scope.page) {
        return;
      }
      Restangular.one('projects').get({
        page: page,
        pageSize: pageSize,
        type: type
      }).then(function(response) {
        $timeout(function(){
          $rootScope.showLoadingToast = false;
        },200);
        $scope.pageCount = response.pageCount;
        $scope.projectStatusMap = response.projectStatusMap;
        var serverTime = response.serverTime || (new Date().getTime());
        for (var i = 0; i < response.projectList.length; i++) {
          ProjectUtils.projectTimedown(response.projectList[i], serverTime);
          $scope.projectDatas.push(response.projectList[i]);
        };

        $timeout(function() {
          $scope.busy = false;
        }, 10);

      });
    }
    /**
    *债权转让列表
    */
    $scope.getAssignmentList = function(page, pageSize) {
      $rootScope.showLoadingToast = true;
      $scope.busy = true;
      Restangular.one("assignments").get({
        page: page,
        pageSize: pageSize
      }).then(function(response){
        if(response && response.ret !== -1) {
          $timeout(function(){
            $rootScope.showLoadingToast = false;
          },200);
          $scope.pageCount0 = response.pageCount;
           for (var i = 0; i < response.assignments.length; i++) {
            $scope.assignments.push(response.assignments[i]);
          };
          $timeout(function() {
            $scope.busy = false;
          }, 10);
        }
      })
    }
    /**
     * 跳转到详情页
     */
    $scope.toDetail = function(project){
      if($rootScope.timeout){
        $state.go('root.project', {number: project.number});
      }
    }

    
    $scope.tabParam = $stateParams.tab == undefined ? '0' : $stateParams.tab;
    if($scope.tabParam == '0') {
      $scope.getProjectList($scope.page, $scope.pageSize, 5);
    } else if($scope.tabParam == '1'){
      $scope.getProjectList($scope.page, $scope.pageSize, 6);
    } else if ($scope.tabParam == '2') {
      $scope.getAssignmentList($scope.page, $scope.pageSize);
    }
    //pc端路由保持一致
    if($location.path().split('/')[1] == 'assignments') {
      $scope.tabParam = 1;
    }
    $scope.tabParam = parseInt($scope.tabParam);
    $scope.switchTab = function(tabIndex) {
      $scope.tabParam = tabIndex;
      $location.search('tab', tabIndex);
    };
    


    /**
     * 加载更多项目
     */
    $scope.loadMore = function(project, type) {
      if($scope.busy){
        return;
      }
      $scope.busy = true;
      $scope.page = $scope.page + 1;
      if($scope.tabParam == '0') {
        project($scope.page, $scope.pageSize, 5);
      } else if($scope.tabParam == '1'){
        project($scope.page, $scope.pageSize, 6);
      } else if ($scope.tabParam == '2') {
        project($scope.page, $scope.pageSize);
      }
    };

  })

