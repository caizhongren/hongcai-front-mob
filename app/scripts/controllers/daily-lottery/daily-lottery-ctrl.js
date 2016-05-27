'use strict';

angular.module('p2pSiteMobApp')
  .controller('DailyLotteryCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, $location, Restangular, config, DialogService) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;

    $scope.test = config.test;
    $scope.coverLayerFlag = false;
    $scope.activityDetailFlag = false;
    $rootScope.checkSession.promise.then(function() {
      if (!$rootScope.isLogged) {
        $location.path('/login');
        return;
      }

      Restangular.one('dailyPrizes').get().then(function(response){
        $scope.thisWeekCheckinRecords = response;
        console.log(response);
      });
    });

    if ($scope.channelCode){
      Restangular.one('users').post('channel', {
        openId: $rootScope.openid, 
        act: $scope.act,
        channelCode: $scope.channelCode
      });
    }

    $scope.userLotteryRecord = null;
    $scope.drawPrizeAndCheckin = function(){
      Restangular.one('dailyPrizes').one('userUnTakeLotteryRecord').get().then(function(response){
        $scope.userLotteryRecord = response;
        if($scope.userLotteryRecord == null){
          Restangular.one('dailyPrizes').post('checkinAndDrawLottery', {
            userId: $rootScope.userInfo.id
          }).then(function(response){
            if(response.ret === -1){
              alert(response.msg);
              if (response.code == -1216){

              }else if(response.code == -1217){
              
              }else if(response.code == -1218){
              
              }
            }else{
              $scope.userLotteryRecord = response;
              $scope.prizeType = response.prize.type;
            }
          });
        }
      });
    }

    /**
     * 调用微信接口，申请此页的分享接口调用
     * @param  
     * @return 
     */
    $scope.configJsApi = function(){
      var url = location.href.split('#')[0];

      Restangular.one("wechat").one("jsApiConfig").get({
        requestUrl : url
      }).then(function(apiConfig){
        console.log('apiConfig: ' + apiConfig);
        wx.config({
            debug: false,
            appId: config.wechatAppid, // 必填，公众号的唯一标识
            timestamp: apiConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
            signature: apiConfig.signature,// 必填，签名，见附录1
            jsApiList: 
                [
                'onMenuShareAppMessage',
                'hideMenuItems'
                ]
        });
      });
    };

    /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function(){
      var shareLink = config.domain;
      if ($scope.channelCode){
        shareLink = shareLink + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }

      wx.onMenuShareAppMessage({
        title: '',
        desc: '',
        link: shareLink,
        imgUrl: '',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.$apply();

          Restangular.one('users').post('shareActivity', {
            openId: $rootScope.openid, 
            act: $scope.act,
            channelCode: $scope.channelCode
          });
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
    }

    $scope.configJsApi();


    wx.error(function(res){
        // window.location.reload();
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        $scope.configJsApi();
    });

    wx.ready(function(){
      $scope.onMenuShareAppMessage();
    });

    /**
     * 跳转到二维码位置
     */
    $scope.goToAttention = function(){
      $scope.showQRcode = true;
    }

    $scope.formatDate = function(date){
      var dateOfMonth = new Date(date).getMonth() + 1;
      var dateOfHour = new Date(date).getDate();
      var dateStr = dateOfMonth + '.' + dateOfHour;

      return dateStr;
    }
});
