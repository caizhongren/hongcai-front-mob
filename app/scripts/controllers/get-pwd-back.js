'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('GetPwdCtrl', function(checkPwdUtils, $rootScope, $scope, $state, $http, $stateParams, $location, $timeout, CheckMobUtil, CheckPicUtil, md5, register, wechat, mobileCaptcha, HongcaiUser, Restangular, restmod, DEFAULT_DOMAIN) {
    //图形验证码
    $scope.getPicCaptcha = '/hongcai/api/v1/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };
    /**
     * 用户获取手机验证码
     */
    $scope.sendMobileCaptcha = function(user) {
      // 判断手机号码
      if (!user.mobile || user.mobile.length !== 11 || !$rootScope.mobilePattern.test(user.mobile)) {
        return;
      }
      //判断图片验证码
      if (!user.picCaptcha) {
        return;
      }
      // 短信验证码倒计时
      var captcha = document.getElementById("captcha");

      function countDown(obj, second, inOrOut) {
        var getMobile = document.getElementById("usermobile");
        var mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[0678])|(14[0-9]))\d{8}$/;
        var buttonDefaultValue = captcha.innerHTML;
        if (inOrOut === 'out' && window.buttonFlag == 0) {
          return;
        }
        // 如果秒数还是大于0，则表示倒计时还没结束
        if (mobilePattern.test(getMobile.value)) {
          if (second >= 0) {
            // 获取默认按钮上的文字

            if (typeof buttonDefaultValue === 'undefined') {
              buttonDefaultValue = obj.defaultValue;
            }
            // 按钮置为不可点击状态
            obj.disabled = true;
            window.buttonFlag = 0;
            // 按钮里的内容呈现倒计时状态
            //obj.value = buttonDefaultValue + '(' + second + ')';
            obj.innerHTML = second + "s";
            obj.className = '';
            // 时间减一
            second--;
            // 一秒后重复执行
            setTimeout(function() {
              countDown(obj, second, 'in');
            }, 1000);
            // 否则，按钮重置为初始状态
          } else {
            // 按钮置为可点击状态
            obj.disabled = false;
            window.buttonFlag = 1;
            // 按钮里的内容恢复初始状态
            obj.className = '';
            obj.innerHTML = "重新发送";
          }
        } else {
          obj.disabled = true;
          window.buttonFlag = 0;
        }
      }
      /**
       * 获取短信验证码
       */
      mobileCaptcha.$create({
        mobile: user.mobile,
        picCaptcha: user.picCaptcha,
      }).$then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg(response.msg);
        }else {
          countDown(captcha, 60, 'out');
        }
      });
    };
    /**
     * 监测用户手机号
     */
    $scope.$watch('user.mobile', function(newVal) {
        CheckMobUtil.checkMob(newVal);
      })
      /**
       * 监测图形验证码
       */
    $scope.$watch('user.picCaptcha', function(newVal) {
      CheckPicUtil.checkePic(newVal);
    })

    /**
     * 获取验证码进行下一步
     */
    $scope.newPwd = function(mobile, captcha, picCaptcha) {
      if (!mobile || !captcha || !picCaptcha) {
        return;
      }

      //判断手机号码
      if (!$rootScope.mobilePattern.test(mobile)) {
        $rootScope.showMsg('手机号码格式不正确');
        return;
      }
      if (picCaptcha.length < 4 || $scope.checkPic == false) {
        $rootScope.showMsg('图形验证码有误');
        return;
      }

      HongcaiUser.$find('/checkMobileCaptcha', {
        mobile: mobile,
        captcha: captcha
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.getCaptchaErr = response.msg;
          $rootScope.showMsg(response.msg);
        } else {
          $state.go('root.getPwd2', {
            mobile: mobile,
            captcha: captcha
          });
        }
      });
    };

    $scope.$watch('user.captcha', function(newVal, oldVal) {
      $scope.sendMsg = true;
      if (!newVal || newVal == undefined) {
        $scope.sendMsg = false;

      }
      $scope.getCaptchaErr = null;
    });

    $scope.mobileNum = $stateParams.mobile;
    $scope.captchaNum = $stateParams.captcha;



    /**
     * 下一步修改密码
     */
    $scope.$watch('chg.newPassword1', function(newVal) {
      if (!newVal) {
        return;
      }

      //调用checkPwdUtils，判断密码是否含非法字符
      checkPwdUtils.showPwd1(newVal);
    })

    $scope.$watch('chg.newPassword2', function(newVal) {
      if (newVal === undefined) {
        return;
      }

      checkPwdUtils.eqPwd($scope.chg.newPassword1, $scope.chg.newPassword2);

    })
    $scope.changePassword = function(chg) {
      $scope.msg = '';
      if (chg.newPassword1 !== chg.newPassword2) {
        $rootScope.showMsg('两次密码输入不一致');
        return;
      }

      var msg = checkPwdUtils.showPwd2(chg.newPassword1);
      if(msg){
        return;
      }

      restmod.model(DEFAULT_DOMAIN + '/users/resetMobilePassword')
        .$create({
          mobile: $scope.mobileNum,
          captcha: $scope.captchaNum,
          password: md5.createHash(chg.newPassword2)
        }).$then(function(response) {
          if (response.ret === -1) {
            $scope.changePasswordMsg = response.msg;
          } else {
            $state.go('root.login');
          }
        });
    }
  });
