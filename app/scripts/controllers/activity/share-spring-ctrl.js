'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSpringCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, $location, $anchorScroll, Restangular, config, DialogService) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

    $scope.test = config.test;
    $scope.coverLayerFlag = false;
    $scope.level = 1;
    //freeWishStatics.status:1.第一关，2.第一关结束，3第二关，4第二关结束，5第三关，6第三关结束
    //buttonFlag:1.我要现金2.我的任务3.开启第二关4.开启第三关5.我的账户
    $scope.buttonFlag = 1;
    $scope.buttonValue = "我要现金";
    $rootScope.checkSession.promise.then(function(){

        $scope.freeWishStatics = Restangular.one('freeWishes').one('freeWishStatics').get();

    });


    $scope.totalReward = Restangular.one('freeWishes').one('totalReward').get();
    $scope.activity = Restangular.one('activitys').one('freeWish').get();

    if ($scope.channelCode){
      Restangular.one('freeWishes').post('channel', {
        openId: $rootScope.openid, 
        act: $scope.act,
        channelCode: $scope.channelCode
      });
    }

    /**
     * 跳转到二维码位置
     */
    $scope.goToAttention = function(){
      $location.hash('attention');
      $anchorScroll();
    }


    /**
     * 继续我的砸罐之旅
     */
    $scope.goOn = function(){
      Restangular.one('freeWishes', $rootScope.userInfo.id).one('myFreeWish').get({
        level: $scope.level
      }).then(function(response){
        $scope.goOnMyWay = false;
        var rediretUrl = config.domain + '/share-spring/detail/' + response.number;
        window.location.href = rediretUrl;
      });
    }

    /**
     * 领取免费愿望
     * @return freeWish
     */
    $scope.openFreeWish = function(){
      if (!($rootScope.bindWechat || $rootScope.isLogged)){
        //引导用户关注
        $scope.goToAttention();
        return;
      }
      
      Restangular.one('freeWishes').post('addFreeWish', {
        userId: $rootScope.userInfo.id,
        level: $scope.level
      }).then(function(response){
          if(response.ret === -1){
            alert(response.msg);
          }else{
            var rediretUrl = config.domain + '/share-spring/detail/' + response.number;
            if ($scope.channelCode){
              rediretUrl = rediretUrl + '?f=' + $scope.channelCode + '&act=' + $scope.act;
            }
            window.location.href = rediretUrl;
          }
      });
    }

    
    
});
