'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('AccountCtrl', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN, md5, Restangular, $location) {
    
    $scope.userHeadImgUrl = '/images/user-center/avatar.png';

    HongcaiUser.$find(0 + '/account').$then(function(response) {
        // 获取用户金额信息
        $scope.userAccount = response;
    });

    HongcaiUser.$find(0 + '/increaseRateCoupon').$then(function(response) {
      if(response.ret == -1){
        return;
      }

      // 获取用户金额信息
      $scope.couponStatis = response;
      if(response.couponTypes.length <= 0){
        $scope.couponFlag = true;
      } else if(response.couponTypes.length > 0){
        $scope.sNum = 0;
        $scope.bNum = 0;
        for(var i=0;i < response.coupons.length;i++){
          if(response.coupons[i].rate === 0.5){
            $scope.sNum += 1;
          }else if(response.coupons[i].rate === 1){
            $scope.bNum += 1;
          }
        }
      }

    });

    HongcaiUser.$find(0 + '/userInviteNum').$then(function(response) {
      $scope.inviteNum = response.inviteNum || 0;
    });

    /**
     * 推荐项目
     */
    Restangular.one('projects').one('recommends').get({
      pageSize : 1
    }).then(function(response) {
      $scope.recommends = response;
    });


    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function() {
      $state.go('root.yeepay-transfer', {
        type: 'autoTransfer',
        number: "null"
      });
    }


    $scope.goWithdraw = function() {
      $state.go("root.userCenter.withdraw");
    }

    $scope.goRecharge = function() {
      $state.go("root.userCenter.recharge");
    }


    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '账户总览',
    }, {
      title: '我的投资'
    }];


    $scope.useExperience = false;
    $scope.quickInvest = function(){
      if($rootScope.securityStatus.trusteeshipAccountStatus === 1){
        if($scope.userAccount.experienceAmount > 100){
          $state.go('root.experience-project-detail',{});
        }
      }else{
        $rootScope.toRealNameAuth();
      }
    }


    //查看更多 index:0体验金，1加息券，2邀请
    $scope.viewMore = function(index){
      $state.go('root.userCenter.grade',{
        tab : index
      });
    }
  });
