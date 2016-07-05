'use strict';
angular.module('p2pSiteMobApp')
  .controller('SendMoneyCtrl', function($rootScope, $scope, $state, $stateParams, $location, $timeout, $window, ipCookie, Restangular, config) {
    $rootScope.showFooter = false;
    $scope.test = config.test;

    if($rootScope.channelCode){
      console.log($rootScope.channelCode);
      console.log($rootScope.act);
      Restangular.one('users').post('channel', {
        openId: $rootScope.openid, 
        act: $rootScope.act,
        channelCode: $rootScope.channelCode
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
      var shareLink = config.domain + '/activity/send-money';
      if ($rootScope.channelCode){
        shareLink = shareLink + '?f=' + $rootScope.channelCode + '&act=' + $rootScope.act;
      }

      wx.onMenuShareAppMessage({
        title: '投资送688元！奖金可立即提现！',
        desc: '现在参与活动，每次投资，还赠2%加息券一张！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/8MZDOEkib8Al0UHTrddN5KGSB1iaL3yDCGYOr19JXcqHnMgEIJiaJTxLg6wMSkJUEA1ic7jlP1UY972icVXibKuQuIkA/0?wx_fmt=jpeg',
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

      wx.onMenuShareTimeline({
        title: '投资送688元！奖金可立即提现！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/8MZDOEkib8Al0UHTrddN5KGSB1iaL3yDCGYOr19JXcqHnMgEIJiaJTxLg6wMSkJUEA1ic7jlP1UY972icVXibKuQuIkA/0?wx_fmt=jpeg',
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
          window.location.href=config.domain + '/activity/send-money?' + Math.round(Math.random()* 1000);
        }, 100);
    });

    wx.ready(function(){
      $scope.onMenuShareAppMessage();
    });

    $scope.configJsApi();

});
