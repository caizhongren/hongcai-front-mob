'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterCtrl', function(CheckPicUtil, checkPwdUtils, $http, DEFAULT_DOMAIN, Restangular, $timeout, $rootScope, $scope, $state, $stateParams, CheckMobUtil, md5, register, wechat, mobileCaptcha, ipCookie) {
    // 注册链接上是否有邀请码
    $scope.btn = 'haha';
    if ($stateParams.inviteCode) {
      $scope.user = {
        inviteCode: $stateParams.inviteCode,
        mobileCaptchaType:1
      };
    }
    $scope.showRegistrationAgreement = false;
    $scope.toggle = function() {
      $scope.showRegistrationAgreement = !$scope.showRegistrationAgreement;
    };

    $scope.checkPassword = function(password){
      var msg = checkPwdUtils.showPwd2(password);
      if (msg) {
        return false;
      }
      return true;
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

    var openId = $rootScope.openId;
    var signUpBe = register;
    $scope.signUp = function(user) {
      if (!$scope.checkMobile(user.mobile) || !$scope.checkPassword(user.password) || !$scope.checkPicCaptchLength(user.picCaptcha)) {
        return;
      }

      var act;
      if(ipCookie('act') && !isNaN(ipCookie('act'))){
        act = ipCookie('act');
      }

      signUpBe.$create({
        // name: user.name,
        picCaptcha: user.picCaptcha,
        password: md5.createHash(user.password),
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: user.inviteCode,
        channelCode: ipCookie('utm_from'),
        act: act,
        channelParams: ipCookie('channelParams')
      }).$then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
        } else {
          $rootScope.user = {
            id: response.id
          };
          $state.go('root.register-success', {
            userId: $rootScope.user.id
          });
        }
      })

    };

    //监测手机号码
    $scope.$watch('user.mobile', function(newVal) {
      CheckMobUtil.checkMob(newVal);
    })

    //监测图形验证码
    $scope.$watch('user.picCaptcha', function(newVal) {
      $scope.piccha = false;
      var msg = CheckPicUtil.checkePic(newVal);
      if(msg){
        $scope.piccha = true;
      }
    })

    //监测密码
    $scope.$watch('user.password', function(newVal) {
      if (!newVal) {
        return;
      }
      //调用checkPwdUtils，判断密码是否含非法字符
      checkPwdUtils.showPwd1(newVal);

    })

    //监测邀请码
    $scope.$watch('user.inviteCode', function(newVal) {
      if (newVal === undefined) {
        return;
      }

      var valLgth4 = newVal.toString().length;
      if (valLgth4 >= 11) {
        $http({
          method: 'POST',
          url: '/hongcai/api/v1/activity/checkInviteCode?inviteCode=' + newVal
        }).success(function(response) {
          if (response.data.isValid === 1) {
            $rootScope.msg = '';
          } else if (response.data.isValid === 0) {
            $rootScope.showMsg('邀请码不存在');
          }
        }).error(function() {
          $rootScope.showMsg('邀请码不存在');
        });
      }
    })

    // 用户获取短信验证码
    $scope.sendMobileCaptcha = function(user) {
      if(!user){
        return;
      }

    };

    //邀请码
    $scope.investCode = false;

    //图形验证码
    $scope.getPicCaptcha = '/hongcai/api/v1/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };

    //解决input checkbox checked不起作用问题
    $scope.checked = function() {
      if ($('#isremind').is(':checked')) {
        $("#isremind").removeAttr("checked");
      } else {
        $("#isremind").prop("checked", true);
      }
    }

  });
