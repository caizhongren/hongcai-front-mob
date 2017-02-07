'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('AccountCtrl', function ($scope, $state, DEFAULT_DOMAIN, Restangular) {

    /**
     * 默认头像
     */
    $scope.userHeadImgUrl = '/images/user-center/avatar.png';

    $scope.userAccount = Restangular.one('users').one('0/account').get().$object;

    // $scope.voucher = Restangular.one('users').one('0/userInviteNum').get().$object;

    $scope.couponStatis = Restangular.one('users').one('0/increaseRateCoupon').get().$object;
    $scope.cashCouponStatis = Restangular.one('users').one('0/cashCoupon').get().$object;

    $scope.unGotCash = Restangular.one('cashCoupons').one('stat').get().$object;

    /**
     * 推荐项目
     */
    $scope.recommends = Restangular.one('projects').one('recommends').get({pageSize : 1}).$object;

    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function() {
      $state.go('root.yeepay-transfer', {
        type: 'autoTransfer',
        number: "null"
      });
    }

    /*
    *风险测评 结果
    */
    $scope.recentlyQuestionnaire = function() {
      Restangular.one('/users/' + '0' + '/recentlyQuestionnaire' ).get().then(function(response){
       if(response.score1 == -1 && response.score2 == -1){
        $scope.showQuestionnaire = true;
       }else {
        $scope.showQuestionnaire = false;
       }
      })
    }
    $scope.recentlyQuestionnaire();

    $scope.goWithdraw = function() {
      $state.go("root.userCenter.withdraw");
    }

    $scope.goRecharge = function() {
      $state.go("root.userCenter.recharge");
    }

    //查看更多 index:0体验金，1加息券，2邀请
    $scope.goIncreaseRateCoupon = function(index){
      $state.go('root.userCenter.grade',{
        tab : index
      });
    }
  });
