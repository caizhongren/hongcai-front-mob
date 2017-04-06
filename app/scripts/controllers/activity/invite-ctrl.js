/*
* @Author: yuyang
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   yuyang
* @Last Modified time: 2017-04-06 09:12:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('InviteCtrl', function($rootScope, $scope, $state, $stateParams, $location, $timeout, Restangular, restmod, DEFAULT_DOMAIN, config, HongcaiUser) {
  	
  	//立即邀请
    $scope.toInvite = function(){
      if(!$rootScope.isLogged) {
        $state.go('root.login', {redirectUrl: encodeURIComponent($location.url('/invite-activity'))});
        return;
      }
      if($scope.isActivityEnd){
        alert(response.msg);
        return;
      }
      $scope.isShare = true;
    }
    // 是否邀请过好友
  	Restangular.one('users').one('0/isInvitedFriends').get({}).then(function(response){
  		$scope.isInvitedFriends = response;
      if(response && response.ret !== -1) {
      }else if(response.code = -1041){        
        $scope.isActivityEnd = true; // 活动已结束
      }
      alert(isActivityEnd);
  	})

  	// 活动规则弹窗
  	$scope.showBox = function() {
      $scope.showRules = !$scope.showRules;
      $scope.showRules ? $('.invite').addClass('position-fix')  : $('.invite').removeClass('position-fix'); 
    }

    // 查看奖励-跳转到奖励页
    $scope.toInviteList = function(){
      if(!$rootScope.isLogged){
        return;
      }else{
        $state.go('root.activity.reward', {
          userId: $stateParams.userId
       });
      }
    }

  })