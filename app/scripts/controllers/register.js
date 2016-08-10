'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterCtrl', function(Restangular, $timeout, $rootScope, $scope, $state, $stateParams, md5, register, wechat, mobileCaptcha, ipCookie) {
    // 注册链接上是否有邀请码
    if ($stateParams.inviteCode) {
      $scope.user = {
        inviteCode: $stateParams.inviteCode
      };
    }

    $scope.showRegistrationAgreement = false;
    $scope.toggle = function () {
      $scope.showRegistrationAgreement = !$scope.showRegistrationAgreement;
    };

    var openId = $rootScope.openId;
    var signUpBe = register;
    $scope.signUp = function(user) {
      signUpBe.$create({
        // name: user.name,
        picCaptcha: user.picCaptcha,
        password: md5.createHash(user.password),
        mobile: user.mobile,
        captcha: user.captcha,
        inviteCode: user.inviteCode,
        channelCode : ipCookie('utm_from'),
        act: ipCookie('act'),
        channelParams: ipCookie('channelParams')
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.captchaShow = true;
          $scope.msg = response.msg;
          $scope.showMsg();
        } else {
          $rootScope.user = {
            id: response.id
          };
          $state.go('root.register-success', {
            userId: $rootScope.user.id
          });
        }
      });
    };

    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      mobileCaptcha.$create({
        mobile: user.mobile
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = response.msg;
          $scope.showMsg();
        }
      });
    };

    //邀请码
    $scope.investCode = false;

    // 设置密码显示方式
    $scope.showEyes = true;
    console.log($scope.showEyes);
    $scope.selectEyes = function(){
      $scope.showEyes = !$scope.showEyes;
      if(!$scope.showEyes){
        angular.element('.input-pwd').prop("type","text");
      }else{
        angular.element('.input-pwd').prop("type","password");
      }
    }

    //图形验证码
    $scope.getPicCaptcha = '/hongcai/api/v1/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };



    //监测手机号码
    $scope.mobileShow = false;
    var phoneNum_regexp = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
    var pwd_regexp = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
    var pwd_regexp2 = /^[^~!@#$%^&*$#]+$/;
    console.log(pwd_regexp2.test('^'));
    $scope.$watch('user.mobile', function(value){
      if(value && !phoneNum_regexp.test(value)){
        $scope.mobileShow = true;
        $scope.msg = '手机号码格式不正确';
        console.log($scope.msg);
      }else if(value){
        Restangular.one('/users/').post('isUnique',{
          account: value
        }).then(function(response){
          $scope.mobileShow = true;
          $scope.msg = response.msg;
          console.log($scope.msg);
        })
      }
      $scope.showMsg();
    })
    $scope.$watch('user.password', function(newVal, oldVal){
      if(!pwd_regexp.test(newVal)){
        $scope.mobileShow = true;
        $scope.msg = '密码6-16位，需包含字母和数字';
      }
      if(!pwd_regexp2.test(newVal)){
        $scope.mobileShow = true;
        $scope.msg = '密码含非法字符';
      }
        console.log($scope.msg);
        $scope.showMsg();
    })

    //设置错误提示
    console.log($scope.msg);
    $scope.showErrorMsg = false;
    $scope.showMsg = function(){
      if($scope.msg){
        $scope.showErrorMsg = true;
        $timeout(function() {
          $scope.showErrorMsg = false;
        }, 3000);
      }
    }
  });
