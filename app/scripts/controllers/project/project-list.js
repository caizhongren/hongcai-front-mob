'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectListCtrl
 * @description
 * # ProjectListCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectListCtrl', function($scope, Restangular, ProjectUtils){
  	$scope.page = 1;
    $scope.pageSize = 4;
  	$scope.widthFlag = "";
  	$scope.jigoubaoData = [];

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

    /**
     * 当前页项目列表
     */
    $scope.getProjectList = function(page, pageSize) {
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

        $scope.busy = false;

      });
    }

    $scope.getProjectList($scope.page, $scope.pageSize);

    /**
     * 加载更多项目
     */
    $scope.loadMore = function() {
      if($scope.busy){
        return;
      }
      $scope.busy = true;
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.getProjectList($scope.page, $scope.pageSize);
    };

  })

