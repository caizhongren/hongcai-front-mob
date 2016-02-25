'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSpringCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config, DialogService) {
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
        if($rootScope.bindWechat || $rootScope.isLogged){
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

    Restangular.one('freeWishes').one('totalReward').get().then(function(response){
      $scope.totalReward = response;
    });

    Restangular.one('activitys').one('freeWish').get().then(function(response){
      $scope.activity = response;
    });
    
    
});
