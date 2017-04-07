/*
* @Author: fuqiang1
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-30 19:00:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('RewardCtrl', function(ipCookie, $scope, $state, $rootScope, $stateParams, $location, Restangular, SessionService, UserService, Utils) {

    $scope.deviceCode = Utils.deviceCode();

    if(SessionService.isLogin()){
        
        $scope.inviteCount = Restangular.one('activitys').one('invitePrivilegedUsers').get().$Object;
        Restangular.one('activitys').one('invitePrivilegedRewardStat').get()
        .then(function(response){
        	if (response  && response.ret !== -1) {
        		$scope.privilegedCapital = response;
        	}
        });

        Restangular.one('activitys').one('invitePrivilegedRewards').get({
        	page: 1,
        	pageSize: 10
        }).then(function(response){
        	if (response  && response.ret !== -1) {
        		$scope.details = response;
        	}
        });
      }

      $scope.intervalDays = function(firstInvestTime){
      	var currentDate = new Date().getTime();
      	var oneDay = 24 * 60 * 60 * 1000;
      	var intervalTimes = currentDate - firstInvestTime;
      	var interDays = 60 - parseInt(intervalTimes/oneDay);

      	return interDays > 0 ? interDays : 0;
      }

      

  })
  