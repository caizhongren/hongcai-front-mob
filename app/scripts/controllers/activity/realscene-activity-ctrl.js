'use strict';

angular.module('p2pSiteMobApp')
  .controller('RealSceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.test = config.test;
    $scope.userHeadImgUrl = '/images/activity/head@2x.png';
    $scope.baseFileUrl = config.base_file_url;
    $scope.wechat = config.wechat_id;
    $scope.inviteFlag = false;
    $scope.showinviteFlag = function() {
      $scope.inviteFlag = true;
    }
    $scope.hideinviteFlag = function() {
      $scope.inviteFlag = false;
    }

    $rootScope.checkSession.promise.then(function() {
        if($rootScope.channelCode){
          Restangular.one('users').post('channel', {
            openId: $rootScope.openid, 
            act: $rootScope.act,
            channelCode: $rootScope.channelCode
          });
        }
    });

    /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function() {
      var shareLink = config.domain + '/share-scene/' + $stateParams.sceneId;
      var words = $scope.commentData.words;
      var desc = $scope.comments[0].commenter + ':' + $scope.comments[0].message;
      if ($rootScope.channelCode) {
        shareLink = shareLink + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
      }

      // 分享到朋友
      wx.onMenuShareAppMessage({
        title: words,
        desc: desc,
        link: shareLink,
        imgUrl: $scope.baseFileUrl + $scope.commentData.scene.url,
        trigger: function(res) {},
        success: function(res) {
          // 分享成功后隐藏分享引导窗口
          Restangular.one('sceneActivity').post('shareSuccess', {
            userSceneId: $scope.commentData.id
          }).then(function(response) {
            $scope.inviteFlag = false;
            $scope.$apply();
          });
          Restangular.one('users').post('shareActivity', {
            openId: $rootScope.openid, 
            act: $rootScope.act,
            channelCode: $rootScope.channelCode
          });
        },
        cancel: function(res) {},
        fail: function(res) {}
      });

      // 分享到朋友圈
      wx.onMenuShareTimeline({
          title: words, // 分享标题
          link: shareLink, // 分享链接
          imgUrl: $scope.baseFileUrl + $scope.commentData.scene.url, // 分享图标
          success: function () { 
              // 用户确认分享后执行的回调函数
            Restangular.one('sceneActivity').post('shareSuccess', {
              userSceneId: $scope.commentData.id
            }).then(function(response) {
              $scope.inviteFlag = false;
              $scope.$apply();
            });
          },
          cancel: function () { 
              // 用户取消分享后执行的回调函数
          }
      });
    }

    /**
     * 调用微信接口，申请此页的分享接口调用
     * @param  
     * @return 
     */
    $scope.configJsApi = function() {
      var url = location.href.split('#')[0];

      Restangular.one("wechat").one("jsApiConfig").get({
        requestUrl: url
      }).then(function(apiConfig) {
        console.log('apiConfig: ' + apiConfig);
        wx.config({
          debug: false,
          appId: config.wechatAppid, // 必填，公众号的唯一标识
          timestamp: apiConfig.timestamp, // 必填，生成签名的时间戳
          nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
          signature: apiConfig.signature, // 必填，签名，见附录1
          jsApiList: [
            'onMenuShareAppMessage',
            'hideMenuItems',
            'onMenuShareTimeline'
          ]
        });
      });
    };

    wx.error(function(res) {
      window.location.reload();
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      $scope.configJsApi();
    });

    wx.ready(function() {
      $scope.onMenuShareAppMessage();
      // wx.hideMenuItems({
      //   menuList: ['menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      // });
    });


    Restangular.one('sceneActivity', 'userScene').one($stateParams.sceneId).get().then(function(response) {

      $scope.commentData = response;
      $scope.comments = response.comments;
      // console.log($scope.comments);
      $scope.commenters = [];
      for (var i = 0; i < $scope.comments.length; i++) {
        if ($scope.comments[i].commentType === 2) {
          $scope.comments[i].commenter = $scope.commentData.nickName || "danny";
        }
        $scope.commenters[i] = $scope.comments[i].commenter;
        $scope.commenters.push();
      }
      // $scope.commenters = $.unique($scope.commenters);
      Array.prototype.unique3 = function() {
        var res = [];
        var json = {};
        for (var i = 0; i < this.length; i++) {
          if (!json[this[i]]) {
            res.push(this[i]);
            json[this[i]] = 1;
          }
        }
        return res;
      }
      $scope.commenters = $scope.commenters.unique3();
      $scope.commentersData = "";
      for (var j = 0; j < $scope.commenters.length; j++) {
        if (j < $scope.commenters.length - 1) {
          $scope.commentersData += $scope.commenters[j] + "，";
        } else {
          $scope.commentersData += $scope.commenters[j];
        }
      }


      console.log($scope.commenters);
      $scope.configJsApi();

    });

    $scope.showFollowFlag = false;
    $scope.goActivityScenes = function() {
      if (!$rootScope.hasLoggedUser || $rootScope.hasLoggedUser.id <= 0) {
        $scope.showFollowFlag = true;
        return;
      }

      var shareUrl = config.domain + '/activity-scene';
      if ($rootScope.channelCode){
        shareUrl = shareUrl + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
      }
      window.location.href = shareUrl;
    };

  });
