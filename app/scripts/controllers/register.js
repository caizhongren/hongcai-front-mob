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

    $scope.showRegistrationAgreement = false;
    $scope.toggle = function () {
      $scope.showRegistrationAgreement = !$scope.showRegistrationAgreement;
    };
    var openId = $rootScope.openId;
    var signUpBe = register;
    $scope.signUp = function(user) {
      var pwd_regexp = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
      $scope.$watch('user.password', function(oldVal){
        if(!pwd_regexp.test(oldVal)){
          $scope.mobileShow = true;
          $scope.msg = '密码6-16位，需包含字母和数字';
          $scope.showMsg();
          return;
        }else{
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
        }
      })



    };
    $scope.captchaShow = false;
    // 用户获取手机验证码
    $scope.sendMobileCaptcha = function(user) {
      mobileCaptcha.$create({
        mobile: user.mobile
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.captchaShow = true;
          $scope.msg = response.msg;
          $scope.showMsg();
        }
      });
    };

    //邀请码
    $scope.investCode = false;

    // 设置密码显示方式
    $scope.showEyes = true;
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
    var pwd_regexp2 = /^[^~!@#$%^&*]+$/;
    $scope.$watch('user.mobile', function(oldVal){
      if(oldVal !== undefined){
        $scope.msg = '';
        var valLgth = oldVal.toString().length;
        if(valLgth >=11 && !phoneNum_regexp.test(oldVal)){
          $scope.mobileShow = true;
          $scope.msg = '手机号码格式不正确';
          $scope.showMsg();
        }else if(valLgth ===11 && phoneNum_regexp.test(oldVal)){
          Restangular.one('/users/').post('isUnique',{
            account: oldVal
          }).then(function(response){
            $scope.mobileShow = true;
            $scope.msg = response.msg;
            $scope.showMsg();
          })
        }
        $scope.showMsg();
      }
    })
    $scope.$watch('user.password', function(oldVal){
      if(oldVal !== undefined){
        $scope.msg = '';
        var valLgth2 = oldVal.toString().length;
        if(!pwd_regexp2.test(oldVal)){
          $scope.mobileShow = true;
          $scope.msg = '密码含非法字符';
          $scope.showMsg();
        }
        if(valLgth2 >16){
          $scope.mobileShow = true;
          $scope.msg = '密码6-16位，需包含字母和数字';
          $scope.showMsg();
        }
        $scope.showMsg();
      }
    })
    $scope.$watch('user.picCaptcha', function(oldVal){
      if(oldVal !== undefined){
        $scope.msg = '';
        var valLgth3 = oldVal.toString().length;
        if(valLgth3 >=4){
          $http({
            method: 'POST',
            url: DEFAULT_DOMAIN + '/captchas/checkPic?captcha=' + oldVal
          }).success(function(data) {
            if(data == true) {
              $scope.showMsg();
            } else {
              $scope.mobileShow = true;
              $scope.msg = '图形验证码错误';
              $scope.showMsg();
            }
          }).error(function() {
            $scope.mobileShow = true;
            $scope.msg = '图形验证码错误';
            $scope.showMsg();
          });
        }
        $scope.showMsg();
      }
    })
    $scope.$watch('user.inviteCode', function(oldVal){
      if(oldVal !== undefined){
        var valLgth4 = oldVal.toString().length;
        if(valLgth4 >=11){
          $http({
            method: 'POST',
            url: '/hongcai/api/v1/activity/checkInviteCode?inviteCode=' + oldVal
          }).success(function(response) {
            if(response.data.isValid === 1) {
              $scope.mobileShow = false;
              $scope.msg = '';
              $scope.showMsg();
            } else if(response.data.isValid  === 0) {
              $scope.mobileShow = true;
              $scope.msg = '邀请码不存在';
              $scope.showMsg();
            }
          }).error(function() {
              $scope.mobileShow = true;
              $scope.msg = '邀请码不存在';
              $scope.showMsg();
          });
        }
      }
    })

    //设置错误提示
    $scope.showErrorMsg = false;
    $scope.showBtn = true;
    $scope.showMsg = function(){
      if($scope.msg){
        $scope.showErrorMsg = true;
        $scope.showBtn = !$scope.showErrorMsg;
        $timeout(function() {
          $scope.showErrorMsg = false;
          $scope.showBtn = false;
        }, 3000);
      }else{
        $scope.showBtn = true;
      }
    }
    $scope.showChecked = true;
    $scope.checked = function(){
      if($('#isremind').is(':checked')){
        $("#isremind").removeAttr("checked");
        $scope.showChecked = false;
      }else{
        $("#isremind").prop("checked",true);
        $scope.showChecked = true;
      }
    }

  });
