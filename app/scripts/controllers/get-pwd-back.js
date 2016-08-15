'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('GetPwdCtrl', function($rootScope, $scope, $state, $http, $stateParams, $location, $timeout, md5, register, wechat, mobileCaptcha, HongcaiUser, Restangular, restmod, DEFAULT_DOMAIN) {
    //图形验证码
    $scope.getPicCaptcha = '/hongcai/api/v1/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };
    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      /**
       * 判断手机号码
       */
      if (!user.mobile || user.mobile.length !== 11 || !mobilePattern.test(user.mobile)) {
        $scope.msg = '手机号码格式不正确';
        $scope.showMsg();
        return;
      }
      if (!user.picCaptcha || $scope.checkPic == false) {
        $scope.msg = '图形验证码有误';
        $scope.showMsg();
        return;
      }
      /**
       * 验证码倒计时
       */
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

      mobileCaptcha.$create({
        mobile: user.mobile
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.checkePicMsg = true;
          $scope.msg = response.msg;
          $scope.showMsg();

        }
        countDown(captcha, 60, 'out');
      });
    };
    var mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[0678]))\d{8}$/;
    $scope.checkePicMsg = false;
    $scope.$watch('user.mobile', function(oldVal) {
      if (oldVal !== undefined) {
        $scope.msg = '';
        var valLgth = oldVal.toString().length;
        if (valLgth >= 11 && !mobilePattern.test(oldVal)) {
          $scope.checkePicMsg = true;
          $scope.msg = '手机号码格式不正确';
          $scope.showMsg();
        } else if (valLgth === 11 && mobilePattern.test(oldVal)) {
          Restangular.one('/users/').post('isUnique', {
            account: oldVal
          }).then(function(response) {
            if (response.ret == -1) {
              return;
            }
            $scope.checkePicMsg = true;
            $scope.msg = "该手机号还未注册";
            $scope.showMsg();
          })
        }
        $scope.showMsg();
      }
    })
    $scope.$watch('user.picCaptcha', function(oldVal) {
      $scope.checkPic = false;
      if (oldVal !== undefined) {
        $scope.msg = '';
        var valLgth3 = oldVal.toString().length;
        if (valLgth3 >= 4) {
          $http({
            method: 'POST',
            url: DEFAULT_DOMAIN + '/captchas/checkPic?captcha=' + oldVal
          }).success(function(data) {
            if (data == true) {
              $scope.checkPic = true;
            } else {
              $scope.checkePicMsg = true;
              $scope.msg = '图形验证码错误';
              $scope.showMsg();
            }
          }).error(function() {
            $scope.checkePicMsg = true;
            $scope.msg = '图形验证码错误';
            $scope.showMsg();
          });
        }
        $scope.showMsg();
      }
    })

    //获取验证码进行下一步
    $scope.newPwd = function(mobile, captcha) {
      if (!mobile || !captcha) {
        return;
      }

      HongcaiUser.$find('/checkMobileCaptcha', {
        mobile: mobile,
        captcha: captcha
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.getCaptchaErr = response.msg;
          $scope.msg = response.msg;
          $scope.showMsg();
        } else {
          $state.go('root.modifyPwd', {
            mobile: mobile,
            captcha: captcha
          });
        }
      });
    };

    $scope.$watch('user.captcha', function(newVal, oldVal) {
      $scope.getCaptchaErr = null;
    });
    /**
     * 错误提示
     */
    $scope.showMsg = function() {
      if ($scope.msg) {
        $scope.checkePicMsg = true;
        $timeout(function() {
          $scope.checkePicMsg = false;
        }, 3000);
      }
    }
    $scope.mobileNum = $stateParams.mobile;
    $scope.captchaNum = $stateParams.captcha;


    //确认找回并修改密码
    // $scope.changePwd = function(pwd1, pwd2) {
    //   if (!pwd1 || !pwd2) {
    //     return;
    //   }

    //   if (pwd1 !== pwd2) {
    //     $scope.changePasswordMsg = "两次密码输入不一致";
    //     return;
    //   }

    //   restmod.model(DEFAULT_DOMAIN + '/users/resetMobilePassword')
    //     .$create({
    //       mobile: $scope.mobileNum,
    //       captcha: $scope.captchaNum,
    //       password: md5.createHash(pwd2)
    //     }).$then(function(response) {
    //       if (response.ret === -1) {
    //         $scope.changePasswordMsg = response.msg;
    //       } else {
    //         $state.go('root.login');
    //       }
    //     });
    // }


  });
