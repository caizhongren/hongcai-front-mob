/*
* @Author: fuqiang1
* @Date:   2016-07-18 10:32:33
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-07-18 15:11:07
*/

'use strict';
angular.module('p2pSiteMobApp')
.controller('ExperienceMoneyCtrl', function ($scope, $rootScope,$state,$location, Restangular,restmod,HongcaiUser) {
 /*体验金查询*/
    $scope.page = 1;
    $scope.pageSize = 4;
    $scope.datas = [];
    $scope.totalPage = 1;
    $scope.dealList = function(){
      if ($scope.totalPage < $scope.page){
        return;
      }
      var dealsReq = HongcaiUser.$find($rootScope.hasLoggedUser.id + '/userInvestExperienceMoneyDeals', {
        page: $scope.page,
        pageSize: $scope.pageSize
      });
      dealsReq.$then(function(response){
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
    $scope.dealList();
  /*
    体验金金额
  */
    Restangular.one('users').one('0/account').get().then(function(response){
      $scope.account = response;
    });

  /*查看更多*/
    $scope.loadMuch = function(){
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.dealList();
    };
  /*跳转到体验金投资页*/
    $scope.quickInvest  = function(){
      if($scope.account.experienceAmount <= 0){
        return;
      }
      $location.url('/experience-project');
    }
});
