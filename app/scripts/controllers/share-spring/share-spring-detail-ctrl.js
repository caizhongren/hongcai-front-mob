'use strict';
angular.module('p2pSiteMobApp').filter('slice', function() {
  return function(arr, start, end) {
    return arr.slice(start, end);
  };
});
angular.module('p2pSiteMobApp')
  .controller('ShareSpringDetailCtrl', function($rootScope, $scope, $state, $stateParams,$anchorScroll, $location, $timeout, Restangular, config, register1, WEB_DEFAULT_DOMAIN, mobileCaptcha, md5) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;
    $scope.test = config.test;
    
    $scope.repeatNums = [];
    $scope.initLimit = 2;
    Restangular.one('freeWishes', $stateParams.id).one('freeWishWithCheerRecords').get().then(function(response){
      $scope.freeWish = response;
      $scope.cheerInt = Math.ceil($scope.freeWish.praiseCount / 6);
      for (var i = 1; i <= $scope.cheerInt; i++) $scope.repeatNums.push(i);

      if($scope.cheerInt === 0){
        $scope.repeatNums = [1];
      }
    });

    $scope.viewMore = function(){
      if ($scope.initLimit + 1 > $scope.cheerInt){
        return;
      }
      $scope.initLimit = $scope.initLimit > $scope.cheerInt ? $scope.cheerInt : $scope.initLimit + 1;
      $scope.loadMoreCheerRecords($scope.initLimit, 6);
    }

    /**
     * 加载更多点赞记录
     */
    $scope.loadMoreCheerRecords = function(page, pageSize){
      Restangular.one('freeWishes', $stateParams.id).one('freeWishCheerRecords').get({
        page: page, 
        pageSize: pageSize
      }).then(function(response){

        if(response.ret !== -1){
          var cheerRecords = response;
          for (var i = cheerRecords.length - 1; i >= 0; i--) {
            $scope.freeWish.cheerRecords.push(cheerRecords[i]);
          }
        }

      });
    }

    $scope.getNumberArray = function(number){
      var numberArray = [];

      for (var i = 0; i < number; i++) { 
        numberArray.push(i) 
      } 
      return numberArray;
    }


    /**
     * 保存未关注用户点赞信息
     */
    $scope.addFreeWishPraise = function(freeWishId){
      Restangular.one('freeWishes', freeWishId).post('addFreeWishPraise', {
        openId: $rootScope.userInfo.openid
      });
    }

    /**
     * 跳转到二维码位置
     */
    $scope.goToAttention = function(){
      $location.hash('attention');
      $anchorScroll();
      $scope.showQRcode = true;
    }

    $scope.notCheer = false;
    $scope.notCheerStatus = 1;

    $scope.hideNotCheer = function(){
      $scope.notCheer = false;

      if (!$scope.freeWishStatics){
          Restangular.one('freeWishes').post('addFreeWish', {
            userId: $rootScope.userInfo.id,
            level: 1
          }).then(function(response){
              if(response.ret !== -1){
                $scope.cheerFreeSuccess = true;
                $scope.myFreeWish = response;
              }
          });
        }

        $scope.goOn();
    }

    /**
     * 助力
     */
    $scope.cheerFreeWish = function(freeWish){
      if (!($rootScope.bindWechat || $rootScope.isLogged)){
        $scope.needSubscribe = true;
        return;
      }


      Restangular.one('freeWishes', $stateParams.id).post('cheerFreeWish', {
        userId: $rootScope.userInfo.id
      }).then(function(response){
          if(response.ret === -1){
            $scope.notCheer = true;
            if (response.code == -1216){
              $scope.notCheerStatus = 1;
            }else if(response.code == -1217){
              $scope.notCheerStatus = 2;
            }else if(response.code == -1218){
              $scope.notCheerStatus = 3;
            }

            $timeout(function() {
              $scope.hideNotCheer();
            }, 2000);
            return;
          }

          var cheerRecord = response;
          cheerRecord.user = $rootScope.userInfo;
          var wishAmount = $scope.freeWish.wishAmount + cheerRecord.amount;
          $scope.freeWish.praiseCount = $scope.freeWish.praiseCount + 1;
          $scope.freeWish.cheerRecords.push(cheerRecord);

          if ($scope.freeWishStatics){
            $scope.goOnMyWay = true;

            $timeout(function() {
              $scope.goOn();
            }, 2000);

            return;
          }

          Restangular.one('freeWishes').post('addFreeWish', {
            userId: $rootScope.userInfo.id,
            level: 1
          }).then(function(response){
              if(response.ret !== -1){
                $scope.cheerFreeSuccess = true;
                $scope.myFreeWish = response;

                $timeout(function() {
                  $scope.goDetail($scope.myFreeWish);
                }, 2000);
              }
          });

      });

    }

    $scope.goDetail = function(freeWish){
      var rediretUrl = config.domain + '/share-spring/detail/' + freeWish.id;
      window.location.href = rediretUrl;
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
    $scope.onMenuShareAppMessage = function(wishId){
      var shareLink = config.domain + '/share-spring/detail/' + wishId;
      if ($scope.channelCode){
        shareLink = shareLink + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }

      wx.onMenuShareAppMessage({
        title: '帮我砸罐！你也能拿现金哦~',
        desc: '领现金，每人都有，最高50元！帮好友砸罐，你也能拿现金！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/KuGEE3Ins1MfAAzOa5yTRLicCdpS9iayncKEM6DJFVu4KiaVE0vxyQjYODExibUWJbh47GWNdlAKOma3ruO2y1Jqpg/0?wx_fmt=png',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          // 
          // delete $scope.inviteFlag;
          $scope.hideInviteMask();
          $scope.$apply();

          Restangular.one('freeWishes', wishId).one('shareCount').get();
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
      $scope.onMenuShareAppMessage($stateParams.id);
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

      Restangular.one('freeWishes', $stateParams.id).post('receiveReward', {}).then(function(response){
        if (response.ret == -1){
          alert(response.msg);
        } else {
          var cheerRecords = $scope.freeWish.cheerRecords;
          $scope.freeWish = response;
          $scope.freeWish.cheerRecords = cheerRecords;
          $scope.receiveRewardFlag = true;

          Restangular.one('freeWishes').one('freeWishStatics').get(function(response){
            $scope.freeWishStatics = response;
          });
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


    /**
     * 显示分享朦层
     */
    $scope.showInviteMask = function(){
      $scope.showInviteMaskFlag = true;
    }

    /**
     * 隐藏分享朦层
     */
    $scope.hideInviteMask = function(){
      $scope.showInviteMaskFlag = false;
    }


    $scope.hasSignUp = false;
    /**
     * 注册，成功后领取第一关奖金
     */
    $scope.signUp = function(user) {
      if ($scope.hasSignUp){
        return;
      }

      register1.$create({
        mobile: user.mobile,
        captcha: user.mobileCaptcha,
        inviteCode: user.inviteCode,
        openId: $rootScope.openid,
        nickName: $rootScope.nickName || '无',
        headImgUrl: $rootScope.headImgUrl || '无'
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
        } else {
          $rootScope.userInfo = response.user;
          $scope.receiveReward();
          $scope.registFlag = false;
        }
      });

      // 防止重复点击，3秒钟之内只能点击一次
      $scope.hasSignUp = true;
      $timeout(function() {
        $scope.hasSignUp = false;
      }, 3000);

    };


});
