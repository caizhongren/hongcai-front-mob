/*
* @Author: yuyang
* @Date:   2016-09-07 14:27:45
* @Last Modified by:   yuyang
* @Last Modified time: 2016-09-07 17:10:48
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ActivityCenter', function($scope, $rootScope, $http) {
    $scope.NowTime=new Date().getTime();
    $http({
      method: 'POST',
      url: '/hongcai/api/v1/activity/getActivityBannerList'
    }).success(function(response) {
      $scope.activityBannerList = response.data.activityBannerList;
      for(var i=0; i< $scope.activityBannerList.length; i++){
        var diffTime = ( $scope.activityBannerList[i].endTime - $scope.NowTime ) / (1000*60*60);
        $scope.activityBannerList[i].dueDayTime = Math.floor(diffTime / 24);
        $scope.activityBannerList[i].dueHourTime = Math.ceil(diffTime) % 24;
      }
    }).error(function() {
    });
  })
