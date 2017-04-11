/*
* @Author: yuyang
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   yuyang
* @Last Modified time: 2017-04-06 09:12:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('InviteCtrl', function($rootScope, $scope, $state, $stateParams, $location, $timeout, Restangular, config, SessionService, InviteShareUtils, Utils) {
  	
    // 是否邀请过好友
  	Restangular.one('users').one('0/isInvitedFriends').get({}).then(function(response){
  		$scope.isInvitedFriends = response;
      if(response && response.ret !== -1) {
      }else if(response.code = -1041){        
        $scope.isActivityEnd = true; // 活动已结束
      }
  	})

  	// 活动规则弹窗
  	$scope.showBox = function() {
      $scope.showRules = !$scope.showRules;
      $scope.showRules ? $('.invite').addClass('position-fix')  : $('.invite').removeClass('position-fix'); 
    }

    // 查看奖励-跳转到奖励页
    $scope.toInviteList = function(){
      if(!$rootScope.isLogged){
        return;
      }else{
        $state.go('root.activity.reward', {
          userId: $stateParams.userId
       });
      }
    }

    //立即邀请
    $scope.toInvite = function(){
      if(!$rootScope.isLogged) {
        $state.go('root.login', {redirectUrl: encodeURIComponent($location.url())});
        return;
      }
      if($scope.isActivityEnd){
        alert(response.msg);
        return;
      }
      $scope.isShare = true;
    }
    $scope.configJsApi = function(){
      var url = location.href.split('#')[0];
      console.log(url);
      Restangular.one("wechat").one("jsApiConfig").get({
        requestUrl : url
      }).then(function(apiConfig){
        console.log('apiConfig: ' + config.wechatAppid);
        wx.config({
            debug: false,
            appId: apiConfig.appId, // 必填，公众号的唯一标识
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
    $scope.onMenuShareAppMessage = function(title, subTitle, shareLink, imgUrl){
      alert(title);
      wx.onMenuShareAppMessage({
        title: title,
        desc: subTitle,
        link: shareLink,
        imgUrl: imgUrl,
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
        title: title,
        link: shareLink,
        imgUrl: imgUrl,
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

    if(Utils.isWeixin()){
      //邀请码
      $scope.voucher = Restangular.one('users/0').one('voucher').get().$object;
      $scope.configJsApi();
      
      wx.error(function(res){
        $timeout(function() {
          window.location.href=config.domain + '/activity/invite-activity?' + Math.round(Math.random()* 1000);
        }, 100);
      });

      wx.ready(function(){
        $scope.shareItem = InviteShareUtils.share($scope.voucher.inviteCode);
        alert('ready' + $scope.shareItem);
        $scope.onMenuShareAppMessage($scope.shareItem.title, $scope.shareItem.subTitle, $scope.shareItem.linkUrl, $scope.shareItem.imageUrl);
      });
    }
  })