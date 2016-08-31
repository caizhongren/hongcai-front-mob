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
    if ($stateParams.inviteCode) {
      $scope.user = {
        inviteCode: $stateParams.inviteCode
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
      if(picCaptcha.toString().length<4){
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

      signUpBe.$create({
        // name: user.name,
        picCaptcha: user.picCaptcha,
        password: md5.createHash(user.password),
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: user.inviteCode,
        channelCode: ipCookie('utm_from'),
        act: ipCookie('act'),
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
      if (user.mobile && $rootScope.mobilePattern.test(user.mobile) && user.picCaptcha && $scope.piccha === false) {
        var mobileBtn = document.getElementById('mess');
        var buttonDefaultValue = mobileBtn.innerHTML;

        function countDown(obj, second, inOrOut) {
          var getMobile = document.getElementById("mobilesignup");
          if (inOrOut === 'out' && window.buttonFlag == 0) {
            return;
          }

          // 如果秒数还是大于0，则表示倒计时还没结束
          if ($rootScope.mobilePattern.test(getMobile.value)) {
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
          mobile: user.mobile,
          picCaptcha: user.picCaptcha,
          type: 1
        }).$then(function(response) {
          if (response.ret === -1) {
            $scope.showMsg(response.msg);
          } else {
            countDown(mobileBtn, 60, 'out');
          }
        });
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
