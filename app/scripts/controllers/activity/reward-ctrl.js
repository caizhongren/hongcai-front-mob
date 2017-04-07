/*
* @Author: fuqiang1
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-30 19:00:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('RewardCtrl', function(ipCookie, $scope, $state, $rootScope, $stateParams, $location, Restangular, SessionService, UserService) {

    // console.log(document.body.scrollHeight);
    // var height = $window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // height = document.body.scrollHeight > height ? element.scrollHeight : height;
    // angular.element('.invite-reward').css('height', height+'px');

    if(SessionService.isLogin()){
        
        Restangular.one('projects').one('investIncreaseRateCoupon').get({
          projectId : $scope.project.id,
          amount : project.amount
        }).then(function(response) {
          if (response  && response.ret !== -1) {
            $scope.increaseRateCoupons = response;
            if(response.length === 0) {
              $scope.selectIncreaseRateCoupon = null;
              $scope.unSelectCouponMsg = '暂无可用奖励';
            }
            for (var i = 0; i < $scope.increaseRateCoupons.length; i++) {
              if ($scope.rateType === '' && $scope.cashType === '') {
                $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[0];
              }
              if ($scope.rateNum == $scope.increaseRateCoupons[i].number || $scope.cashNum == $scope.increaseRateCoupons[i].number) {
                $scope.selectIncreaseRateCoupon = $scope.increaseRateCoupons[i];
              }
            }
          }else {
            $scope.selectIncreaseRateCoupon = [];
          }
        }); 
      }
   
  })
  