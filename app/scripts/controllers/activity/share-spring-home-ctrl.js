'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSpringHomeCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config, DialogService) {
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
        if($rootScope.userInfo.id > 0){
          Restangular.one('freeWishes').one('freeWishStatics').get().then(function(response){
            if(response !== undefined && response.userId > 0){
                $scope.freeWishStatics = response;
                if($scope.freeWishStatics.status == 1){
                  //正在进行第一关任务，点击按钮进入第一关任务
                  $scope.level = 1;
                  $scope.buttonFlag = 2;
                  $scope.buttonValue = "我要现金";
                }else if($scope.freeWishStatics.status == 2){
                  //第一关完成，点击按钮开启第二关
                  $scope.level = 2;
                  $scope.buttonFlag = 3;
                  $scope.buttonValue = "到账" +freeWishStatics.receiveAmount+"元，再拿30元";
                }else if($scope.freeWishStatics.status == 3){
                  //正在进行第二关任务，点击按钮进入第二关任务
                  $scope.level = 2;
                  $scope.buttonFlag = 2;
                  $scope.buttonValue = "到账" +freeWishStatics.receiveAmount+"元，再拿30元";
                }else if($scope.freeWishStatics.status == 4){
                  //第二关完成，点击按钮开启第三关任务
                  $scope.level = 3;
                  $scope.buttonFlag = 4;
                  $scope.buttonValue = "到账" +freeWishStatics.receiveAmount+"元，再拿100元";
                }else if($scope.freeWishStatics.status == 5){
                  //正在进行第三关任务，点击按钮进入第三关任务
                  $scope.level = 3;
                  $scope.buttonFlag = 2;
                  $scope.buttonValue = "到账" +freeWishStatics.receiveAmount+"元，再拿100元";
                }else if($scope.freeWishStatics.status == 6){
                  //全部通关，点击按钮进入我的账户
                  $scope.level = 3;
                  $scope.buttonFlag = 5;
                  $scope.buttonValue = "查看我的账户";
                }
            }
          });
        }else{
          $scope.coverLayerFlag = true;
        }

        if ($scope.channelCode){
          Restangular.one('freeWishes').post('channel', {
            openId: $rootScope.openid, 
            act: $scope.act,
            channelCode: $scope.channelCode
          });
        }
 
    });
    
    $scope.freeWishes = Restangular.one('freeWishes').getList().$object;
    Restangular.one('freeWishes').one('totalReward').get().then(function(response){
      $scope.totalReward = response;
    });


    $scope.buttonClick = function(buttonFlag){
      if(buttonFlag == 1 || buttonFlag == 3 || buttonFlag == 4){
        $scope.openFreeWish();
      }else if(buttonFlag == 2){
        $scope.goShareDetail();
      }else if(buttonFlag == 5){
        $scope.goAccount();
      }
    }

    /**
     * 领取免费愿望
     * @return freeWish
     */
    $scope.openFreeWish = function(){
      if (!$rootScope.userInfo || $rootScope.userInfo.id == 0){
        //引导用户关注
        $scope.coverLayerFlag = true;
        return;
      }
      
      Restangular.one('freeWishes').post('addFreeWish', {
        userId: $rootScope.userInfo.id,
        level: $scope.level
      }).then(function(response){
          console.log(response);
          if(response.ret === -1){
            // DialogService.alert('领取出错', response.msg, function(){
            //   $rootScope.alert = null;
            // });
            alert(response.msg);
          }else{
            var rediretUrl = config.domain + '/'+ $scope.getShareDetailUrl($scope.level)  +'/' + response.number;
            if ($scope.channelCode){
              rediretUrl = rediretUrl + '?f=' + $scope.channelCode + '&act=' + $scope.act;
            }
            window.location.href = rediretUrl;
          }
      });
    }

    $scope.goShareDetail = function(){
      Restangular.one('freeWishes', $rootScope.userInfo.id).one('myFreeWish').get({
          level : $scope.level
        }).then(function(response){
        if(response !== undefined && response.id > 0){
          $state.go($scope.getShareDetailUrl($scope.level),{
            number: response.number,
            act: $scope.act,
            f: $scope.channelCode
          });
        }
      });
    }

    $scope.getShareDetailUrl = function(level){
      var url = "root.share-spring-detail";
      if(level == 1){
        url = "root.share-spring.mydetail";
      }else if(level == 2){
        url = "root.share-spring.mydetail";
      }else if(level == 3){
        url = "root.share-spring.mydetail";
      }

      return url;
    }

    $scope.goAccount = function(){
      window.location.href = config.domain + '/user-center/account'
    }
});
