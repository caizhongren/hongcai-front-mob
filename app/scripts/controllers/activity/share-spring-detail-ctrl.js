'use strict';
angular.module('p2pSiteMobApp').filter('slice', function() {
  return function(arr, start, end) {
    return arr.slice(start, end);
  };
});
angular.module('p2pSiteMobApp')
  .controller('ShareSpringDetailCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, Restangular, config, register1, WEB_DEFAULT_DOMAIN, mobileCaptcha, md5) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;
    $scope.test = config.test;
    
    $scope.repeatNums = [];
    $scope.initLimit = 2;
    Restangular.one('freeWishes', $stateParams.number).one('freeWishWithCheerRecords').get().then(function(response){
      $scope.freeWish = response;
      $scope.cheerInt = $scope.freeWish.cheerRecords.length / 6;
      $scope.cheerInt = $scope.cheerInt > parseInt($scope.cheerInt) && $scope.cheerInt > 1 ? parseInt($scope.cheerInt) + 1 : parseInt($scope.cheerInt);
      for (var i = 1; i <= $scope.cheerInt; i++) $scope.repeatNums.push(i);
    });

    $scope.viewMore = function(){
      $scope.initLimit = $scope.initLimit > $scope.cheerInt ? $scope.cheerInt : $scope.initLimit + 1;
    }


    /**
     * 保存未关注用户点赞信息
     */
    $scope.addFreeWishPraise = function(freeWishId){
      Restangular.one('freeWishes', freeWishId).post('addFreeWishPraise', {
        openId: $rootScope.userInfo.openid
      });
    }

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
            var rediretUrl = config.domain + '/share-spring/detail/' + response.number;
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
          $state.go('root.share-spring.detail',{
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

          if ($scope.freeWishStatics){
            $scope.goOnMyWay = true;
            return;
          }

          Restangular.one('freeWishes').post('addFreeWish', {
            userId: $rootScope.userInfo.id,
            level: 1
          }).then(function(response){
              if(response.ret !== -1){
                $scope.cheerFreeSuccess = true;
                $scope.myFreeWish = response;
              }
          });

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
        var rediretUrl = config.domain + '/share-spring/detail/' + response.number;
        window.location.href = rediretUrl;
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
    $scope.onMenuShareAppMessage = function(wishNumber){
      var shareLink = config.domain + '/share-spring/detail/' + wishNumber;
      if ($scope.channelCode){
        shareLink = shareLink + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }

      wx.onMenuShareAppMessage({
        title: '帮我砸罐！你也能拿现金哦~',
        desc: '领现金，每人都有，最高50元！帮好友砸罐，你也能拿现金！',
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




    /**
     * 领取奖励
     */
    $scope.receiveReward = function(){
      if($rootScope.userInfo.mobile == null){
        return;
      }

      Restangular.one('freeWishes', $stateParams.number).post('receiveReward', {}).then(function(response){
        if (response.ret == -1){
          alert(response.msg);
        } else {
          $scope.freeWish = response;
          alert('领取成功，' + $scope.freeWish.amount + '元已经打入您的账户，请到账户查看。');
          window.location.href = config.domain + '/user-center/account';
        }
      });
    }

    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };

    $scope.sendMobileCaptcha = function(user) {
      if (!user.picCaptcha){
        $scope.showPicCaptchaError = true;
        return;
      } else {
        $scope.showPicCaptchaError = false;
      }


      mobileCaptcha.$create({
        mobile: user.mobile
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.captchaShow = true;
          $scope.msg = response.msg;
        }
      });
    };

    $scope.signUp = function(user) {
      register1.$create({
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: user.inviteCode,
        openId: $rootScope.openid,
        nickName: $rootScope.nickName || '无',
        headImgUrl: $rootScope.headImgUrl || '无'
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.errorMobileMsg = response.msg;
          console.log($scope.errorMobileMsg);
        } else {
          $rootScope.userInfo = response.user;
          $scope.receiveReward();
          $scope.registFlag = false;
        }
      });

    };


});
