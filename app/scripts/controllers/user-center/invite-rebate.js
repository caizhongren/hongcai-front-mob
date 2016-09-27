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
    $scope.pageSize = 4;
    $scope.datas = [];
    $scope.totalPage = 1;


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

    $scope.inviteList = function(){

      if ($scope.totalPage < $scope.page){
        return;
      }

      var couponsReq = HongcaiUser.$find('0' + '/inviteList' , {
        page: $scope.page,
        pageSize: $scope.pageSize,
        status: status
      });
      couponsReq.$then(function(response){
        if(response.$status === 'ok'){
          $scope.totalPage = response.totalPage;
          for (var i = 0; i < response.data.length; i++) {
            $scope.datas.push(response.data[i]);
          };
        } else{
            $scope.msg = '获取信息失败';
        }
      });
     //$scope.DealBusy = false;
    };
    $scope.inviteList();

    $scope.loadMuch = function(tabIndex, subtabIndex){
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.initData(tabIndex, subtabIndex);
    };

    /**
     * 跳转到邀请落地页
     */

  });

