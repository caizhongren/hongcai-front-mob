'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareSpringDetailCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config, DialogService) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;
    $scope.test = config.test;
    
    Restangular.one('freeWishes').one($stateParams.number).one('freeWishWithCheerRecords').get().then(function(response){
      $scope.freeWish = response.freeWish;
      $scope.freeWish.cheerRecords = response.cheerRecords;
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
      if (!($rootScope.bindWechat || $rootScope.isLogged)){
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
            // alert(rediretUrl);
            if ($scope.channelCode){
              rediretUrl = rediretUrl + '?f=' + $scope.channelCode + '&act=' + $scope.act;
            }
            // alert(rediretUrl);
            window.location.href = rediretUrl;
          }
      });
    }

    $scope.goShareDetail = function(){
      Restangular.one('freeWishes', $rootScope.userInfo.id).one('myFreeWish').get({
          level : $scope.level
        }).then(function(response){
        if(response !== undefined && response.id > 0){
          $state.go($scope.getShareDetailState($scope.level),{
            number: response.number,
            act: $scope.act,
            f: $scope.channelCode
          });
        }
      });
    }


    /**
     * 助力
     */
    $scope.cheerFreeWish = function(freeWish){
      if (!($rootScope.bindWechat || $rootScope.isLogged)){
        $scope.needSubscribe = true;
        return;
      }


      Restangular.one('freeWishes', $stateParams.number).post('cheerFreeWish', {
        userId: $rootScope.userInfo.id
      }).then(function(response){
          if(response.ret === -1){
            var msg = '不能点赞了哦';
            if (response.code == -1217){
              msg = "讨厌啦，大好人！你的点赞次数已经用完咯！";
            }else{
              msg = msg + " " + response.msg;
            }

            alert(msg);
            return;
          }
          var cheerRecord = response;
          cheerRecord.user = $rootScope.userInfo;
          var wishAmount = $scope.freeWish.wishAmount + cheerRecord.amount;
          $scope.freeWish.praiseCount = $scope.freeWish.praiseCount + 1;
          $scope.freeWish.cheerRecords.push(cheerRecord);

          if (!$scope.freeWishStatics){ // 未参加过活动
            Restangular.one('freeWishes').post('addFreeWish', {
              userId: $rootScope.userInfo.id,
              level: 1
            }).then(function(response){
                console.log(response);
                if(response.ret === -1){
                  // alert(response.msg);
                }else{
                  $scope.cheerFreeSuccess = true;
                  $scope.myFreeWish = response;
                  // var rediretUrl = config.domain + '/'+ $scope.getShareDetailUrl($scope.level)  +'/' + response.number;
                  // alert(rediretUrl);
                  // if ($scope.channelCode){
                  //   rediretUrl = rediretUrl + '?f=' + $scope.channelCode + '&act=' + $scope.act;
                  // }
                  // alert(rediretUrl);
                  // window.location.href = rediretUrl;
                }
            });
          } else {
            $scope.goOnMyWay = true;
          }

      });

    }

    $scope.goDetail = function(freeWish){
      var rediretUrl = config.domain + '/share-spring/detail/' + freeWish.number;
      window.location.href = rediretUrl;
    }

    $scope.goOn = function(){

      Restangular.one('freeWishes', $rootScope.userInfo.id).one('myFreeWish').get({
        level: $scope.level
      }).then(function(response){
        $scope.goOnMyWay = false;
        var rediretUrl = config.domain + '/'+ $scope.getShareDetailUrl($scope.level)  +'/' + response.number;
        window.location.href = rediretUrl;
      });
    }


    $scope.getShareDetailState = function(level){
      var stateStr = "root.share-spring-detail";
      if(level == 1){
        stateStr = "root.share-spring.mydetail";
      }else if(level == 2){
        stateStr = "root.share-spring.mydetail";
      }else if(level == 3){
        stateStr = "root.share-spring.mydetail";
      }

      return stateStr;
    }

    $scope.getShareDetailUrl = function(level){
      var url = "share-spring/detail";
      if(level == 1){
        url = "share-spring/mydetail";
      }else if(level == 2){
        url = "share-spring/mydetail";
      }else if(level == 3){
        url = "share-spring/mydetail";
      }

      return url;
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
    $scope.onMenuShareAppMessage = function(wishNumber){
      var shareLink = config.domain + '/share-spring/detail/' + wishNumber;
      if ($scope.channelCode){
        shareLink = shareLink + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }

      wx.onMenuShareAppMessage({
        title: '亲 这次一定要帮我呢',
        desc: '没有什么比现金更实在的。帮我点赞，你也一起来拿钱！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/KuGEE3Ins1Oc1gSxsWNG7hnKVzX83nWM3rQsiaPNUdqWoR7DddJAW7H7Iico9rad9armXmH9UM8veRvicaoBEpeTA/0?wx_fmt=png',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.inviteFlag = false;
          $scope.$apply();

          Restangular.one('freeWishes', wishNumber).one('shareCount').get();
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
      $scope.onMenuShareAppMessage($stateParams.number);
    });

    $scope.goAccount = function(){
      window.location.href = config.domain + '/user-center/account'
    }
});
