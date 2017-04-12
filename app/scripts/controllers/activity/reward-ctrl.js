/*
* @Author: fuqiang1
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-30 19:00:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('RewardCtrl', function(ipCookie, $scope, $state, $rootScope, $stateParams, $location, Restangular, SessionService, UserService, Utils, InviteShareUtils, WechatShareUtils, $window) {

    $scope.deviceCode = Utils.deviceCode();

    if(SessionService.isLogin()){
        
        Restangular.one('activitys').one('invitePrivilegedUsers').get() .then(function(response){
          if (response  && response.ret !== -1) {
            $scope.inviteCount = response;
          }
        });
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
        		$scope.details = response.data;
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
      //下载app
      $scope.downloadApp = function() {
        $window.location.href = ' http://a.app.qq.com/o/simple.jsp?pkgname=com.hoolai.hongcai';
     }

      if(SessionService.isLogin() && Utils.isWeixin()){
        //邀请码
        $scope.voucher = Restangular.one('users/0').one('voucher').get().$object;
        WechatShareUtils.configJsApi();
        
        wx.error(function(res){
          $timeout(function() {
            window.location.href=config.domain + '/activity/invite?' + Math.round(Math.random()* 1000);
          }, 100);
        });

        wx.ready(function(){
          $scope.shareItem = InviteShareUtils.share($scope.voucher.inviteCode);
          WechatShareUtils.onMenuShareAppMessage($scope.shareItem.title, $scope.shareItem.subTitle, $scope.shareItem.linkUrl, $scope.shareItem.imageUrl);
        });
      }

  })
  