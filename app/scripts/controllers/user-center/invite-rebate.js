'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:GradeCtrl
 * @description
 * # AboutCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('InviteRebateCtrl',function ($scope, $state, $rootScope, $location, HongcaiUser) {
    $scope.page = 1;
    $scope.pageSize = 6;
    $scope.datas = [];


    /**
     * 邀请统计
     */

    $scope.getInviteStat = function(){
      HongcaiUser.$find('0' + '/inviteStat', {}).$then(function(response){
        if(response.$status === 'ok' && response.ret !== -1){
          $scope.inviteStat = response;
        } else{
            $scope.msg = '获取信息失败';
        }
      });
    }
    $scope.getInviteStat();
    //邀请码
    $scope.voucher = HongcaiUser.$find('0' + '/voucher').$then();

    /**
     * 邀请用户列表统计
     */
    $scope.inviteList = function(page){
      if ($scope.page > Math.ceil($scope.total/6)){
        return;
      }
      var couponsReq = HongcaiUser.$find('0' + '/inviteList' , {
        page: page,
        pageSize: $scope.pageSize
      });
      couponsReq.$then(function(response){
        if(response.$status === 'ok'){
          $scope.totalPage = response.totalPage;
          $scope.total = response.total;
          $scope.loadMoreData =  Math.ceil($scope.total/6);
          for (var i = 0; i < response.data.length; i++) {
            $scope.datas.push(response.data[i]);
          };
        } else{
            $scope.msg = '获取信息失败';
        }
      });
     //$scope.DealBusy = false;
    };
    $scope.inviteList($scope.page);

    //查看更多邀请用户
    $scope.loadMuch = function(){
      $scope.page = $scope.page + 1;
      $scope.inviteList($scope.page);
    };

    /**
     * 跳转到邀请人列表
     * 
     */
     $scope.toInvestList = function() {
        //如果邀请好友为 0 ，点击系统自带的弹窗提示 文案：“你还没有邀请到好友哦～”
        $state.go('root.userCenter.invite-rebate-list');
     }

  });

