/*
* @Author: yuyang
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   yuyang
* @Last Modified time: 2017-04-06 09:12:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('InviteCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, restmod, DEFAULT_DOMAIN, config, HongcaiUser) {
  	
  	//立即邀请
    $scope.toInvite = function(){
      if(!$rootScope.isLogged) {
        $state.go('root.login');
      }else {
      	
      }
    
    }
    // 是否邀请过好友
  	Restangular.one('users').one('0/isInvitedFriends').get({}).then(function(response){
  		$scope.isInvitedFriends = response;
  	})

  	// 活动规则弹窗
  	$scope.showBox = function() {
      $scope.showRules = !$scope.showRules;
      $scope.showRules ? $('.invite').addClass('position-fix')  : $('.invite').removeClass('position-fix'); 
    }
  })