/*
* @Author: yuyang1
* @Date:   2016-07-25 17:24:33
*/

'use strict';
angular.module('p2pSiteMobApp')
.controller('CashCouponCtrl', function ($scope, $rootScope, Restangular) {
	/*现金券查询*/

	/**
	 * 默认头像
	 */
	$scope.userHeadImgUrl = '/images/user-center/avatar.png';

	$scope.userAccount = Restangular.one('users').one('0/account').get().$object;

	$scope.voucher = Restangular.one('users').one('0/userInviteNum').get().$object;

	$scope.couponStatis = Restangular.one('users').one('0/increaseRateCoupon').get().$object;
	
	/*使用规则*/
	$scope.showRules = false;
	$scope.showRule = function(){
		$scope.showRules = true;
	}
	$scope.closeRule = function() {
		$scope.showRules = false;
	}
});
 