/*
* @Author: fuqiang1
* @Date:   2016-07-18 10:32:33
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-26 10:14:48
*/

'use strict';
angular.module('p2pSiteMobApp')
.controller('ExperienceMoneyCtrl', function ($scope, $rootScope,$state,$location, Restangular,restmod,HongcaiUser, UserService) {
 /*体验金查询*/
    $scope.page = 1;
    $scope.pageSize = 4;
    $scope.datas = [];
    $scope.totalPage = 1;
    
    UserService.loadUserAuth($scope);
    UserService.loadAccount($scope);
    $scope.dealList = function(){
      if ($scope.totalPage < $scope.page){
        return;
      }
      var dealsReq = HongcaiUser.$find('0' + '/userInvestExperienceMoneyDeals', {
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
    };
    $scope.dealList();

  /*查看更多*/
    $scope.loadMuch = function(){
      $scope.page = $scope.page + 1;
      $scope.pageSize = $scope.pageSize;
      $scope.dealList();
    };
  /*跳转到体验金投资页*/
    $scope.quickInvest  = function(){
      if($scope.account.experienceAmount <= 100){
        return;
      }
      if($scope.userAuth.authStatus !== 2){
        $rootScope.toRealNameAuth();
      }
      if($scope.userAuth.authStatus == 2 && $scope.userAuth.active === false){
        $rootScope.activate();
      }
      if($scope.userAuth.authStatus == 2 && $scope.userAuth.active === true){
        $location.url('/experience-project');
      }
    }
});
