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
    $rootScope.checkSession.promise.then(function() {

      Restangular.one('freeWishes').one('freeWishStatics').get().then(function(response){
        if (response.ret == -1){
          return;
        }

        $scope.freeWishStatics = response;
        if (!$scope.freeWishStatics){
          return;
        }

        if ($scope.freeWishStatics.status == 1){
          $scope.level = 1;
        } else if ($scope.freeWishStatics.status == 2){
          $scope.level = 2;
        } else if ($scope.freeWishStatics.status == 3){
          $scope.level = 2;
        } else if ($scope.freeWishStatics.status == 4){
          $scope.level = 3;
        } else if ($scope.freeWishStatics.status == 5){
          $scope.level = 3;
        } else if ($scope.freeWishStatics.status == 6){
          $scope.level = 3;
        }

      });

    });

    Restangular.one('freeWishes').one('totalReward').get().then(function(response){
      $scope.totalReward = response;
    });

    Restangular.one('activitys').one('freeWish').get().then(function(response){
      $scope.activity = response;
    });

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
