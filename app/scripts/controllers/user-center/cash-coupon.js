/*
* @Author: yuyang1
* @Date:   2016-07-25 17:24:33
*/

'use strict';
angular.module('p2pSiteMobApp')
.controller('CashCouponCtrl', function ($scope, $rootScope, $state, Restangular, ipCookie) {
	/**
	 * 默认头像
	 */
	$scope.userHeadImgUrl = '/images/user-center/avatar.png';

	$scope.userAccount = Restangular.one('users').one('0/account').get().$object;

	$scope.voucher = Restangular.one('users').one('0/userInviteNum').get().$object;

	$scope.couponStatis = Restangular.one('users').one('0/increaseRateCoupon').get().$object;
	/*如何获取*/
	$scope.toGet = function() {
		$state.go('root.activity.send-coupon');
	}
	/*使用规则*/
	$scope.showRules = false;
	$scope.showRule = function(){
		$scope.showRules = true;
	}
	$scope.closeRule = function() {
		$scope.showRules = false;
	}

	/*投资统计*/
	Restangular.one('cashCoupons').one('stat').get().then(function(response) {
		$scope.cash = response;
	});

	/*现金券查询*/
	$scope.status = 1;
  $scope.cashCoupons = [];
	/*解决闪烁问题*/
	$scope.loading = true;

	/*选择提现状态*/
	$scope.selectStat = function(status){
		$scope.loading = true;
		$scope.cashCoupons = [];
		$scope.status = status;
		var queryStatus = status === 1 ? '1' : '2,4';
		Restangular.one('cashCoupons').get({
			status : queryStatus
		}).then(function(response){
			$scope.loading = false;
			for (var i = 0; i < response.data.length; i++) {
				$scope.cashCoupons.push(response.data[i]);
			}
		});
	}
	$scope.selectStat($scope.status);
  $scope.toProjectList = function($index){
    if($rootScope.timeout){
      $state.go('root._main-list-temp');
    }
    ipCookie('cashNum', $scope.cashCoupons[$index].number);
    ipCookie('cashType', $scope.cashCoupons[$index].type);
  }

});

