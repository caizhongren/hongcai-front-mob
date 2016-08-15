'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterCtrl', function($http, DEFAULT_DOMAIN, Restangular, $timeout, $rootScope, $scope, $state, $stateParams, md5, register, wechat, mobileCaptcha, ipCookie) {
    // 注册链接上是否有邀请码
    if ($stateParams.inviteCode) {
      $scope.user = {
        inviteCode: $stateParams.inviteCode
      };
    }

    $scope.showErrorMsg = false;
    $scope.showRegistrationAgreement = false;
    $scope.toggle = function() {
      $scope.showRegistrationAgreement = !$scope.showRegistrationAgreement;
    };
    var openId = $rootScope.openId;
    var signUpBe = register;
    $scope.signUp = function(user) {
      var pwd_regexp = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
      if (!pwd_regexp.test(user.password)) {
        $scope.msg = '密码6-16位，需包含字母和数字';
        $scope.showErrorMsg = true;
        $scope.showMsg();
        return;
      }
      if(user.picCaptcha.toString().length<4){
        $scope.msg = '图形验证码错误';
        $scope.showErrorMsg = true;
        $scope.showMsg();
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
          $scope.msg = response.msg;
          $scope.showErrorMsg = true;
          $scope.showMsg();
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


    //邀请码
    $scope.investCode = false;

    // 设置密码显示方式
    $scope.showEyes = true;
    $scope.selectEyes = function() {
      $scope.showEyes = !$scope.showEyes;
      if (!$scope.showEyes) {
        angular.element('.input-pwd').prop("type", "text");
      } else {
        angular.element('.input-pwd').prop("type", "password");
      }
    }

    //图形验证码
    $scope.getPicCaptcha = '/hongcai/api/v1/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };


    //监测手机号码
    // $scope.mobileShow = false;
    var phoneNum_regexp = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
    var pwd_regexp2 = /^[^~!@#$%^&*]+$/;
    $scope.$watch('user.mobile', function(oldVal) {
      $scope.mobileShow = false;
      if (oldVal !== undefined) {
        $scope.msg = '';
        var valLgth = oldVal.toString().length;
        if (valLgth >= 11 && !phoneNum_regexp.test(oldVal)) {
          $scope.msg = '手机号码格式不正确';
          $scope.showErrorMsg = true;
          $scope.showMsg();
        } else if (valLgth === 11 && phoneNum_regexp.test(oldVal)) {
          Restangular.one('/users/').post('isUnique', {
            account: oldVal
          }).then(function(response) {
            $scope.msg = response.msg;
            $scope.showErrorMsg = true;
            $scope.showMsg();
          })
        } else if (valLgth >= 11 && $scope.msg === '') {
          $scope.showMsg();
        }
      }
    })
    $scope.$watch('user.password', function(oldVal) {
      $scope.mobileShow = false;
      if (oldVal !== undefined) {
        $scope.msg = '';
        var valLgth2 = oldVal.toString().length;
        if (!pwd_regexp2.test(oldVal)) {
          $scope.msg = '密码含非法字符';
          $scope.showErrorMsg = true;
          $scope.showMsg();
        } else if (valLgth2 > 16) {
          $scope.msg = '密码6-16位，需包含字母和数字';
          $scope.showErrorMsg = true;
          $scope.showMsg();
        } else if ($scope.msg === '') {
          $scope.showMsg();
        }
      }
    })
    $scope.$watch('user.picCaptcha', function(oldVal) {
      $scope.piccha = false;
      $scope.mobileShow = false;
      if (oldVal !== undefined) {
        $scope.msg = '';
        var valLgth3 = oldVal.toString().length;
        if (valLgth3 >= 4) {
          $http({
            method: 'POST',
            url: DEFAULT_DOMAIN + '/captchas/checkPic?captcha=' + oldVal
          }).success(function(data) {
            if (data == true) {
              $scope.piccha = true;
              $scope.showpic =false;
            } else {
              $scope.msg = '图形验证码错误';
              $scope.showErrorMsg = true;
              $scope.showpic =true;
              $scope.showMsg();
            }
          }).error(function() {
            $scope.msg = '图形验证码错误';
            $scope.showErrorMsg = true;
            $scope.showMsg();
          });
        } else if (valLgth3 >= 4 && $scope.msg === '') {
          $scope.showMsg();
        }
        if(valLgth3 ===4 && $scope.showErrorMsg === false){
          $scope.showErrorMsg = false;
        }
      }
    })
    $scope.$watch('user.inviteCode', function(oldVal) {
      $scope.mobileShow = false;
      if (oldVal !== undefined) {
        var valLgth4 = oldVal.toString().length;
        if (valLgth4 >= 11) {
          $http({
            method: 'POST',
            url: '/hongcai/api/v1/activity/checkInviteCode?inviteCode=' + oldVal
          }).success(function(response) {
            if (response.data.isValid === 1) {
              $scope.mobileShow = false;
              $scope.msg = '';
              $scope.showMsg();
            } else if (response.data.isValid === 0) {
              $scope.msg = '邀请码不存在';
              $scope.showErrorMsg = true;
              $scope.showMsg();
            }
          }).error(function() {
            $scope.msg = '邀请码不存在';
            $scope.showErrorMsg = true;
            $scope.showMsg();
          });
        }
      }
    })

    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      if (user.mobile && phoneNum_regexp.test(user.mobile) && user.picCaptcha && $scope.piccha ===true) {
        var mobileBtn = document.getElementById('mess');
        var buttonDefaultValue = mobileBtn.innerHTML;
        function countDown(obj, second, inOrOut) {
          var getMobile = document.getElementById("mobilesignup");
          var mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;

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
            $scope.msg = response.msg;
            $scope.showErrorMsg = true;
          }
          countDown(mobileBtn,60,'out');
        });
      }

    };



    //设置错误提示
      $scope.showBtn = true;
    $scope.showMsg = function() {
      if ($scope.msg) {
        // $scope.showErrorMsg = true;
        // $scope.showBtn = true;
        $timeout(function() {
          $scope.showErrorMsg = false;
          $scope.showBtn = false;
        }, 2000);
      } else {
        $scope.showBtn = true;
      }
    }
    //解决input checkbox checked不起作用问题
    $scope.checked = function() {
      if ($('#isremind').is(':checked')) {
        $("#isremind").removeAttr("checked");
      } else {
        $("#isremind").prop("checked", true);
      }
    }

  });
