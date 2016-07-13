'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectListCtrl
 * @description
 * # ProjectListCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectListCtrl', function($scope, $state, $rootScope, $stateParams, $location, Restangular, restmod, config,DateUtils){
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

    $scope.getTempData = function() {
      if ($scope.pageCount < $scope.page) {
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
    $scope.getTempData();
    $scope.loadDealMuch = function() {
      $scope.DealBusy = true;
      $scope.page = $scope.page + 1;
      $scope.pageCount = $scope.pageCount + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.getTempData();

      $scope.DealBusy = false;
    };

  })

