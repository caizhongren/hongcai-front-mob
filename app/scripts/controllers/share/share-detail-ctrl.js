'use strict';

angular.module('p2pSiteMobApp')
  .controller('ShareDetailCtrl', function($rootScope, $scope, $state, $stateParams, $timeout, $location, md5, register, mobileCaptcha, Restangular, config, DialogService) {
    $rootScope.showButton = false;

    $scope.test = config.test;
    $scope.activityDetailFlag = false;
    //viewerFlag 1本人查看愿望，2他人查看愿望
    $scope.viewerFlag = 1;
    $scope.sloganClass = 'heart slogan send-you';
    
    $scope.firstMsg = '';
    $scope.secondMsg = '';

    $scope.buttonValue = '';
    // buttonFlag  1:邀请好友帮忙，2：帮TA点赞，3：领取我的奖金(免费愿望)，4：立即领取(奖励)，5：查看我的账户
    $scope.buttonFlag = 1;

    /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function(wishNumber){
      wx.onMenuShareAppMessage({
        title: 'WO需要你的帮忙',
        desc: '帮我点个赞，为我涨奖金吧，么么哒！',
        link: config.domain + '/share-detail/' + wishNumber,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/KuGEE3Ins1Oc1gSxsWNG7hnKVzX83nWM3rQsiaPNUdqWoR7DddJAW7H7Iico9rad9armXmH9UM8veRvicaoBEpeTA/0?wx_fmt=png',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.inviteFlag = false;
          $scope.$apply();
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
    }


    $scope.getCheerRecordsUserIds = function(freeWishCheerRecords){
        if(freeWishCheerRecords != null && freeWishCheerRecords.length > 0){
            for(var i=0; i<freeWishCheerRecords.length; i++){
                if($rootScope.hasLoggedUser.id === freeWishCheerRecords[i].userId){
                    return true;
                }
            }
        }
        return false;
    }
    
    $scope.initPageMsg = function(){
      if($scope.freeWish.status === 3){
          if($scope.viewerFlag === 1){
              $scope.buttonValue = '领取梦想基金';
              $scope.buttonFlag = 4;

              $scope.firstMsg = $scope.freeWish.praiseCount + '位好友为你点赞';
              $scope.secondMsg = '人品杠杠滴！';
          }else{
            if ($scope.isReceived == true){
              $scope,buttonValue = "查看我的奖金";
            } else {
              $scope.buttonValue = '领取我的奖金';
            }
              $scope.buttonFlag = 3;

              $scope.firstMsg = '好友已成功领取奖金，';
              $scope.secondMsg = '领取你自己的梦想基金吧！';
          }
      }else if($scope.freeWish.status === 4){
          if($scope.viewerFlag === 1){
              $scope.buttonValue = '查看我的账户';
              $scope.buttonFlag = 5;

              $scope.firstMsg = '奖金成功充入';
              $scope.secondMsg = '您的宏财金融账户';
          }else{
              if ($scope.isReceived == true){
                $scope,buttonValue = "查看我的奖金";
              } else {
                $scope.buttonValue = '领取我的奖金';
              }
              $scope.buttonFlag = 3;

              $scope.firstMsg = '好友已成功领取奖金，';
              $scope.secondMsg = '领取你自己的梦想基金吧！';
          }
      }else{
          if($scope.viewerFlag === 1){
              $scope.buttonValue = '邀好友点赞';
              $scope.buttonFlag = 1;

              if($scope.freeWish.praiseCount === 0){
                  $scope.firstMsg = '邀10位好友点赞，才能领取哦';
                  $scope.secondMsg = '快请好友帮忙吧~';
              }else{
                  $scope.firstMsg = $scope.freeWish.praiseCount + '位好友为你点赞';
                  $scope.secondMsg = '人品不错呦~';
              }
          }else{
              $scope.cheerFlag = $scope.getCheerRecordsUserIds($scope.freeWishCheerRecords);

              if($scope.cheerFlag){
                  if ($scope.isReceived == true){
                    $scope.buttonValue = "查看我的奖金";
                  } else {
                    $scope.buttonValue = '领取我的奖金';
                  }
                  $scope.buttonFlag = 3;

                  $scope.firstMsg = '';
                  $scope.secondMsg = '成功为TA点赞！';
              }else{
                  $scope.buttonValue = '帮TA点赞';
                  $scope.buttonFlag = 2;

                  $scope.firstMsg = '帮TA点赞，为TA涨奖金';
                  $scope.secondMsg = '更有100%额外惊喜呦！';
              }
          }
      }
    }

    /**
     * 加载当前页的免费愿望详情
     */
    $rootScope.checkSession.promise.then(function(){
        Restangular.one('freeWishes', $stateParams.number).one('freeWishWithCheerRecords').get().then(function(response){
          $scope.freeWish = response.freeWish;
          $scope.freeWishCheerRecords = response.cheerRecords; 
          $scope.progress = $scope.freeWish.wishAmount * 100 / $scope.freeWish.amount;

          if($rootScope.hasLoggedUser.id !== $scope.freeWish.userId){
            $scope.viewerFlag = 2;
            $scope.sloganClass = 'slogan send-ta';
            // 登录用户是否已经领取
            Restangular.one('freeWishes', $rootScope.hasLoggedUser.id).one('isReceived').get().then(function(response){
              $scope.isReceived = response;
              $scope.initPageMsg();
              $scope.onMenuShareAppMessage($scope.freeWish.number);
            });
            
          } else {
            $scope.initPageMsg();
            $scope.onMenuShareAppMessage($scope.freeWish.number);
          }
        });
    });



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
                'onMenuShareAppMessage'
                ]
        });
      });
    };



    wx.error(function(res){
        window.location.reload();
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        // $scope.configJsApi();
    });



    // buttonFlag  1:邀请好友帮忙，2：帮TA点赞，3：点击领取(免费愿望)，4：立即领取(奖励)，5：查看我的账户
    $scope.buttonClick = function(buttonFlag){
        if(buttonFlag === 1){
          $scope.inviteFlag = true;
        }else if(buttonFlag === 2){
          if($rootScope.hasLoggedUser.id > 0){
            $scope.cheerFreeWish();
          } else {
            $scope.addFreeWishPraise();
            $scope.attentionFlag = true;
          }
        } else if(buttonFlag === 3){ // 点击领取时要判断用户是否已经注册，未注册引导关注
          if ($rootScope.hasLoggedUser.id > 0){
            $scope.openFreeWish();
          } else {
            $scope.attentionFlag = true;
          }
          
        }else if(buttonFlag === 4){
          if($rootScope.hasLoggedUser.mobile != null){
            $scope.receiveReward();
          }else{
            $scope.registFlag = true;
          }
        }else if(buttonFlag === 5){
          $('html').css('font-size','10px');
          $state.go('root.user-center.wishCapital');
        }
    }

  

    /**
     * 领取免费愿望
     * @return {[type]} [description]
     */
    $scope.openFreeWish = function(){
      Restangular.one('freeWishes').post('addFreeWish', {
        userId: $rootScope.hasLoggedUser.id
      }).then(function(response){
          if(response.ret === -1){
            DialogService.alert('领取错误', response.msg, function(){
              $rootScope.alert = null;
            });
            return;
          }

          $scope.freeWish = response;
          $location.path('/share-detail/') + response.number;
          $state.go("root.share-detail",{
            number: response.number
          });
      });
    }


    /**
     * 保存关注用户点赞信息
     */
    $scope.addFreeWishPraise = function(){
      Restangular.one('freeWishes', $scope.freeWish.id).post('addFreeWishPraise', {
        userId: $rootScope.hasLoggedUser.id,
        openId: $rootScope.hasLoggedUser.openid
      }).then(function(response){
          if(response.ret === -1){
            console.log(response.msg);
          }
      });
    }

  /**
   * 点赞好友愿望
   * @return {[type]} [description]
   */
    $scope.cheerFreeWish = function(){
      Restangular.one('freeWishes', $stateParams.number).post('cheerFreeWish', {
        userId: $rootScope.hasLoggedUser.id
      }).then(function(response){
          if(response.ret === -1){
            var msgTitle = '不能点赞了哦';
            if (response.code == -1217){
              msgTitle = '2015年最佳大好人';
            }
            DialogService.alert(msgTitle, response.msg, function(){
              $rootScope.alert = null;
            });
            return;
          }
          var cheerRecord = response;
          cheerRecord.user = $rootScope.hasLoggedUser;
          var wishAmount = $scope.freeWish.wishAmount + cheerRecord.amount;
          $scope.progress = wishAmount * 100 / $scope.freeWish.amount;
          $scope.freeWish.praiseCount = $scope.freeWish.praiseCount + 1;
          $scope.freeWishCheerRecords.push(cheerRecord);

          $scope.initPageMsg();
      });
    }

    $scope.errorMobileMsg = "";
    $scope.signUp = function(user) {
      console.log($rootScope.openid);
      register.$create({
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: user.inviteCode,
        openId: $rootScope.openid,
        nickName: $rootScope.nickName,
        headImgUrl: $rootScope.headImgUrl
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.errorMobileMsg = response.msg;
          console.log($scope.errorMobileMsg);
        } else {
          $rootScope.hasLoggedUser = response.user;
          $scope.receiveReward();
          $scope.registFlag = false;
        }
      });
    };


    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      if (!user || !user.mobile || $scope.buttonFlag == 0)
        return;

      $scope.buttonFlag = 0;

      mobileCaptcha.$create({
        mobile: user.mobile
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.errorMobileMsg = response.msg;
        }
      });

      $timeout(function() {
        $scope.buttonFlag = 1;
      }, 600000);
    };

    /**
     * 领取奖励
     */
    $scope.receiveReward = function(){
      Restangular.one('freeWishes', $stateParams.number).post('receiveReward', {
        userId: $rootScope.hasLoggedUser.id
      }).then(function(response){
        if (response.ret == -1){
          DialogService.alert('领取出错', response.msg, function(){
            $rootScope.alert = null;
          });
        } else {
          $scope.freeWish = response;
          $scope.initPageMsg();
          DialogService.confirm('领取成功', $scope.freeWish.amount + '元已经打入您的账户，请到账户查看。', function(){$rootScope.confirm = null;}, function(){
            $rootScope.confirm = null;
            $('html').css('font-size','10px');
            $state.go('root.user-center.wishCapital');
          });
        }
          
      });
    }

    $scope.configJsApi();

    wx.ready(function(){
      wx.hideMenuItems({
          menuList: ['menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      });
    });

  });
