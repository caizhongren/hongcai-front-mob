'use strict';
angular.module('p2pSiteMobApp')
  .controller('SendMoneyCtrl', function($rootScope, $scope, $state, $stateParams, $anchorScroll, $location, $timeout, $window, Restangular, config, register1, WEB_DEFAULT_DOMAIN, mobileCaptcha, md5, HongcaiUser) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;
    $scope.test = config.test;

    if ($scope.channelCode){
      Restangular.one('users').post('channel', {
        openId: $rootScope.openid, 
        act: $scope.act,
        channelCode: $scope.channelCode
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
      if ($scope.channelCode){
        shareLink = shareLink + '?f=' + $scope.channelCode + '&act=' + $scope.act;
      }

      wx.onMenuShareAppMessage({
        title: '投资送688元！奖金可立即提现！',
        desc: '投资送688元！奖金可立即提现！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/qtXH9iaJ3HiahUdLZGgw5CHJotSh5YxVj2kicib4eUQ6QgpRqtTZEXEFQVYEhkKg6vlnjqFaWrOE9IJMiaosI3csbzg/0?wx_fmt=png',
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

    wx.error(function(res){
        $timeout(function() {
          window.location.href=config.domain + '/activity/send-money?' + Math.round(Math.random()* 1000);
        }, 100);
    });

    wx.ready(function(){
      $scope.onMenuShareAppMessage();
      // wx.hideMenuItems({
      //     menuList: ['menuItem:share:timeline'] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
      // });
    });

    $scope.configJsApi();

});
