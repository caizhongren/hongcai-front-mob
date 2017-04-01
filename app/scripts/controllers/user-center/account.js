'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('AccountCtrl', function ($scope, $state, DEFAULT_DOMAIN, Restangular, toCunGuanUtils, SessionService, UserService) {

    /**
     * 默认头像
     */
    $scope.userHeadImgUrl = '/images/user-center/avatar.png';

    UserService.loadUserAuth($scope);
    UserService.loadAccount($scope);

    // $scope.voucher = Restangular.one('users').one('0/userInviteNum').get().$object;

    $scope.couponStatis = Restangular.one('users').one('0/increaseRateCoupon').get().$object;
    $scope.cashCouponStatis = Restangular.one('users').one('0/cashCoupon').get().$object;

    $scope.unGotCash = Restangular.one('cashCoupons').one('stat').get().$object;


   
    /**
     * 推荐项目
     */
    // $scope.recommends = Restangular.one('projects').one('recommends').get({pageSize : 1}).$object;

    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function() {
      toCunGuanUtils.to('autoTransfer', null, null, null, null, null);
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

    $scope.unread = function() {
      // 查询是否有未读的提醒
      Restangular.one('/userMsgs/' + '0' + '/unReadMsgs' ).get().then(function(response){
        if (response && response.ret !== -1) {
          $scope.unReadMsgs = response;
        }
      })
      // 查询是否有未读的公告
      Restangular.one('/userMsgs/' + '0' + '/unReadNotices' ).get().then(function(response){
        if (response && response.ret !== -1) {
          $scope.unReadNotices = response;
        }
      })
     
    }
    $scope.unread();
    
  });
