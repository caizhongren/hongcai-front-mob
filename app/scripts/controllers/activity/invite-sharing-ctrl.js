/*
* @Author: yuyang
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   yuyang
* @Last Modified time: 2017-04-06 16:12:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('InviteSharingCtrl', function($scope, $timeout, $rootScope, $stateParams, md5, ipCookie, Utils, Restangular, CheckMobUtil, CheckPicUtil, SessionService, WEB_DEFAULT_DOMAIN) {
  	// 图形验证码
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };

    $scope.isSuccess = false;
    $scope.isActivityEnd = false;
    $scope.isSuccess ? $('.invite-sharing').addClass('position-fix')  : $('.invite-sharing').removeClass('position-fix'); 
    $scope.successMask = function() {
    	$scope.isSuccess = !$scope.isSuccess;
    	$scope.isSuccess ? $('.invite-sharing').addClass('position-fix')  : $('.invite-sharing').removeClass('position-fix'); 
    }

    $scope.checkPicCaptchLength = function(picCaptcha){
      if(picCaptcha.toString().length !== 4){
        $rootScope.showMsg('图形验证码错误');
        return false;
      }
      return true;
    }

    $scope.checkMobile = function(mobile){
      if(!$rootScope.mobilePattern.test(mobile)){
        $rootScope.showMsg("手机号码格式不正确");
        return false;
      }
      return true;
    }

    $scope.busy = false;
    $scope.signUp = function(user) {
      if (!$scope.checkMobile(user.mobile) || !$scope.checkPicCaptchLength(user.picCaptcha) || $scope.busy) {
        return;
      }

      var act;
      if(ipCookie('act') && !isNaN(ipCookie('act'))){
        act = ipCookie('act');
      }
       $scope.busy = true;
      Restangular.one('users/').post('register', { 
        password: md5.createHash(generateMixed(6)),
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: $stateParams.inviteCode,
        channelCode: ipCookie('utm_from'),
        act: act,
        channelParams: ipCookie('channelParams'),
        device: Utils.deviceCode(),
        guestId: ipCookie('guestId')
      }).then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
          $timeout(function() {
            $scope.busy = false;
          }, 2000);
        } else {
          // 检测活动是否已结束
          Restangular.one('users').one('0/isInvitedFriends').get({}).then(function(response){
            $scope.isInvitedFriends = response;
            if(response && response.ret !== -1) {
              SessionService.loginSuccess(response);
              $scope.isSuccess = true;
            }else if(response.code = -1041){        
              $scope.isActivityEnd = true; // 活动已结束
              return;
            }
          })
        }
      })
    }

    // 监测手机号码
    $scope.$watch('user.mobile', function(newVal) {
      CheckMobUtil.checkMob(newVal);
    })

     // 监测图形验证码
    $scope.$watch('user.picCaptcha', function(newVal) {
      $scope.piccha = false;
      var msg = CheckPicUtil.checkePic(newVal);
      if(msg){
        $scope.piccha = true;
      }
    })

    // 用户获取短信验证码
    $scope.sendMobileCaptcha = function(user) {
      if(!user){
        return;
      }
    };
    
    // 随机生成
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    function generateMixed(n) {
        var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.ceil(Math.random()*35);
            res += chars[id];
        }
        return res;
    }

    // 邀请好友列表
    Restangular.one('activitys').one('invitePrivilegedFriends').get({
      inviteCode : $stateParams.inviteCode
    }).then(function(response){
      if(response && response.ret !== -1) {
        $scope.inviteList = response;
        for(var i=0;i<$scope.inviteList.length;i++){
           $scope.inviteList[i].encourage = encourageMixed();
        }
      }else if(response.code = -1041){        
        $scope.isActivityEnd = true; // 活动已结束
        return;
      }
    })

    // 激励语随机显示
    var arr = ['从此跟着土豪迈向人生巅峰！','哇~好大的礼包呀，发财啦哈哈哈~~','上宏财，财运来！欧了！','谢谢老板，大礼包收到啦！','自从领了礼包，腰不酸了腿也不疼了~','礼包收到，确实是真爱！','发礼包这事儿，我就服你。。。','天哪~真的有10%加息券耶！'];
    function encourageMixed() {
      return arr[Math.floor(Math.random()*arr.length)];
    }

  })