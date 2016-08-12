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
      mobileCaptcha.$create({
        mobile: user.mobile
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.checkePicMsg = true;
          $scope.msg = response.msg;
          $scope.showMsg();
        }
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
            if(response.ret== -1){
              return;
            }
            $scope.checkePicMsg = true;
            $scope.msg = "该手机号还未注册";
            $scope.showMsg();
          })
        }
        // $scope.showMsg();
      }
    })
    $scope.$watch('user.picCaptcha', function(oldVal) {
        if (oldVal !== undefined) {
          $scope.msg = '';
          var valLgth3 = oldVal.toString().length;
          if (valLgth3 >= 4) {
            $http({
              method: 'POST',
              url: DEFAULT_DOMAIN + '/captchas/checkPic?captcha=' + oldVal
            }).success(function(data) {
              if (data == true) {
                $scope.showMsg();
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
      /**
       * 错误提示
       */
    $scope.showMsg = function() {
      if ($scope.msg) {
        $scope.checkePicMsg = true;
        // $scope.showBtn = true;
        $scope.showBtn = !$scope.checkePicMsg;
        $timeout(function() {
          $scope.checkePicMsg = false;
          // $scope.showBtn = false;
        }, 3000);
      } else {
        // $scope.showBtn = true;
      }
    }
    $scope.mobileNum = $stateParams.mobile;
    $scope.captchaNum = $stateParams.captcha;

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
          console.log($scope.getCaptchaErr);
        } else {
          $state.go('root.getPwd2', {
            mobile: mobile,
            captcha: captcha
          });
        }
      });
    };

    $scope.$watch('user.captcha', function(newVal, oldVal) {
      $scope.getCaptchaErr = null;
    });

    //确认找回并修改密码
    $scope.changePwd = function(pwd1, pwd2) {
      if (!pwd1 || !pwd2) {
        return;
      }

      if (pwd1 !== pwd2) {
        $scope.changePasswordMsg = "两次密码输入不一致";
        return;
      }

      restmod.model(DEFAULT_DOMAIN + '/users/resetMobilePassword')
        .$create({
          mobile: $scope.mobileNum,
          captcha: $scope.captchaNum,
          password: md5.createHash(pwd2)
        }).$then(function(response) {
          if (response.ret === -1) {
            $scope.changePasswordMsg = response.msg;
          } else {
            $state.go('root.login');
          }
        });
    }


  });
