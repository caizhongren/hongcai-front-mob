'use strict';
angular.module('p2pSiteMobApp').filter('slice', function() {
  return function(arr, start, end) {
    return arr.slice(start, end);
  };
});
angular.module('p2pSiteMobApp')
  .controller('InviteCtrl', function($rootScope, $scope, $state, $stateParams, $anchorScroll, $location, $timeout, $window, Restangular, config, register1, WEB_DEFAULT_DOMAIN, mobileCaptcha, md5, HongcaiUser) {
    $rootScope.showFooter = false;
    $scope.act = $stateParams.act;
    $scope.channelCode = $stateParams.f;
    $scope.test = config.test;



    $scope.wantToInvite = function(){
      if(!$rootScope.isLogged){
        alert('您需要先登录');
        $state.go('root.login', {redirectUrl: encodeURIComponent($location.url())});
        return;
      }

      $scope.inviteFlag=true;
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
    $scope.onMenuShareAppMessage = function(shareLink){
      // if(!$rootScope.isLogged){
      //   alert('您需要先登录');
      //   $state.go('root.login', {redirectUrl: encodeURIComponent($location.url())});
      //   return;
      // }

      

      wx.onMenuShareAppMessage({
        title: '注册即领最高68888元体验金！',
        desc: '注册最高可领68888元体验金！分享链接邀请10位好友注册，领150元现金！',
        link: shareLink,
        imgUrl: 'https://mmbiz.qlogo.cn/mmbiz/8MZDOEkib8AlljMIELmyVk1e6yq0sZFznUL3hosJWw2w4J4vQtVibQx8uuP8MoIEoIEEA3ZQpCLRb3dzYvYKL1OQ/0?wx_fmt=png',
        trigger: function (res) {
        },
        success: function (res) {
          // 分享成功后隐藏分享引导窗口
          // 
          // delete $scope.inviteFlag;
          $scope.hideInviteMask();
          $scope.$apply();

        },
        cancel: function (res) {
        },
        fail: function (res) {
        }
      });
    }

    $scope.configJsApi();


    wx.error(function(res){
        // alert('error');
        document.location.href=config.domain + '/activity/invite?' + Math.random();
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        // $scope.configJsApi();
    });

    wx.ready(function(){
      var shareLink = config.domain + '/register//';
      HongcaiUser.$find(0 + '/voucher').$then(function(response) {
        if (response.ret !== -1){
          shareLink = shareLink + response.inviteCode;
        }
        $scope.onMenuShareAppMessage(shareLink);
      });
    });

    $scope.goAccount = function(){
      window.location.href = config.domain + '/user-center/account'
    }


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


});
