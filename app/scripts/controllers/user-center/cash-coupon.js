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
		Restangular.one('cashCoupons').get({
			status : status
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


	/*根据屏幕高度设置内容高度*/
	angular.element('document').ready(function(){
		//初始化宽度、高度
		angular.element(".cash-body").css("min-height",angular.element(window).height()-"220"+"px");
		//当文档窗口发生改变时 触发
		angular.element(window).resize(function(){
		  angular.element(".cash-body").css("min-height",angular.element(window).height()-"220"+"px");
		});
  });
});

