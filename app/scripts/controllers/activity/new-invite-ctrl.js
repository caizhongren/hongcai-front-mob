/*
* @Author: fuqiang1
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-28 17:22:40
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('newInviteCtrl', function($rootScope, $scope, $state, $stateParams, Restangular, restmod, DEFAULT_DOMAIN, config) {
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
        // console.log('apiConfig: ' + apiConfig);
        wx.config({
            debug: false,
            appId: config.wechatAppid, // 必填，公众号的唯一标识
            timestamp: apiConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: apiConfig.nonceStr, // 必填，生成签名的随机串
            signature: apiConfig.signature,// 必填，签名，见附录1
            jsApiList:
                [
                'onMenuShareAppMessage',
                'hideMenuItems',
                'onMenuShareTimeline'
                ]
        });
      });
    };

    /**
     * 设置用户分享的标题以及描述以及图片等。
     */
    $scope.onMenuShareAppMessage = function(){
      var shareLink = config.domain + '/activity/invite-activity';
      if ($rootScope.channelCode){
        shareLink = shareLink + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
      }
      // 分享到朋友
      wx.onMenuShareAppMessage({
        title: '邀好友投资，送60元现金！',
        desc: '邀请壕友加入国资控股宏财网，即可得60元现金奖励！多邀多得，返现金额上不封顶！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/8MZDOEkib8Ak6XibeP4rtlnYOfaCFneic3dYdZU9Gy2CCwjHpjNot1KNxB5XQdsDuTQgUNdVnZlJw38qHm7qsggeg/0?wx_fmt=png',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.$apply();
          Restangular.one('users').post('shareActivity', {
            openId: $rootScope.openid,
            act: $rootScope.act,
            channelCode: $rootScope.channelCode
          });
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
      //分享到朋友圈
      wx.onMenuShareTimeline({
        title: '邀好友投资，送60元现金！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/8MZDOEkib8Ak6XibeP4rtlnYOfaCFneic3dYdZU9Gy2CCwjHpjNot1KNxB5XQdsDuTQgUNdVnZlJw38qHm7qsggeg/0?wx_fmt=png',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          $scope.$apply();
          Restangular.one('users').post('shareActivity', {
            openId: $rootScope.openid,
            act: $rootScope.act,
            channelCode: $rootScope.channelCode
          });
        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
    }

    wx.error(function(res){
        $timeout(function() {
          window.location.href=config.domain + '/activity/invite-activity?' + Math.round(Math.random()* 1000);
        }, 100);
    });

    wx.ready(function(){
      $scope.onMenuShareAppMessage();
    });

    $scope.configJsApi();

  })
