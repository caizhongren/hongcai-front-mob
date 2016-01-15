'use strict';

angular.module('p2pSiteMobApp')
  .controller('RealSceneActivityCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {

    $scope.userHeadImgUrl = '/images/activity/head@2x.png';
    $scope.baseFileUrl = config.base_file_url;
    $scope.wechat = config.wechat_id;
    $scope.BaseWechatUrl = "weixin://profile/";
    $scope.inviteFlag = false;
    $scope.showinviteFlag = function(){
      $scope.inviteFlag = true;
    }
    $scope.hideinviteFlag = function(){
      $scope.inviteFlag = false;
    }

    $rootScope.checkSession.promise.then(function() {
      
    });

    Restangular.one('sceneActivity', 'userScene').one($stateParams.sceneId).get().then(function(response) {

      $scope.commentData = response;
      $scope.comments = response.comments;
      // console.log($scope.comments);
      $scope.commenters = [];
      for (var i = 0; i < $scope.comments.length; i++) {
        if ($scope.comments[i].commentType === 2) {
          $scope.comments[i].commenter = $rootScope.hasLoggedUser.nickName || "danny";
        }
        $scope.commenters[i] = $scope.comments[i].commenter;
        $scope.commenters.push();
      }
      $scope.commenters = $.unique($scope.commenters);
      $scope.commentersData = "";
      for(var j=0;j<$scope.commenters.length;j++){
        if(j<$scope.commenters.length-1){
          $scope.commentersData += $scope.commenters[j]+"，";
        }else{
          $scope.commentersData += $scope.commenters[j];
        }
      }
      

      Restangular.one();

    });

    /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function(sceneId) {
      var shareLink = config.domain + '/share-scene/' + sceneId;
      if ($scope.channelCode) {
        // shareLink = shareLink + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }
      wx.onMenuShareAppMessage({
        title: '测试',
        desc: '测试测试测试',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/KuGEE3Ins1Oc1gSxsWNG7hnKVzX83nWM3rQsiaPNUdqWoR7DddJAW7H7Iico9rad9armXmH9UM8veRvicaoBEpeTA/0?wx_fmt=png',
        trigger: function(res) {},
        success: function(res) {
          // 分享成功后隐藏分享引导窗口
          // $scope.inviteFlag = false;
          // $scope.$apply();
          Restangular.one('sceneActivity', 'shareSuccess').one($stateParams.sceneId).get().then(function(response) {
            alert(response.ret);
          });

        },
        cancel: function(res) {},
        fail: function(res) {}
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
            'hideMenuItems'
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
      $scope.onMenuShareAppMessage($stateParams.sceneId);
      // wx.hideMenuItems({
      //   menuList: ['menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      // });
    });

    $scope.configJsApi();



  });
