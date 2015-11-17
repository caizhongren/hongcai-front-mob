'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AccountCtrl', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {

    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户金额信息
          $scope.userAccount = response;
        } else {
          // 获取信息失败。
        }
      });

      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/increaseRateCoupon').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户金额信息
          $scope.couponStatis = response;
        } else {
          // 获取信息失败。
        }
      });
    });

    $rootScope.selectedSide =  'account';


    $scope.changePassword = function(oldP, newP1, newP2){
      if (!oldP || !newP2 || !newP1){
        return;
      }

      if (newP1 !== newP2){
        $scope.changePasswordMsg = "两次密码输入不一致";
      }

      HongcaiUser.$create($rootScope.hasLoggedUser.id + '/changePassword', {
        oldPassword: oldP,
        newPassword: newP2,
      }).$then(function(response){
        if (response.ret === -1){
          $scope.changePasswordMsg = response.msg;
        } 
      });
    }


    /**
     * 开通自动投标权限
     */
    $scope.toAuthAutoTransfer = function(){
      $state.go('root.yeepay-transfer', {
        type: 'autoTransfer',
        number: "null"
      });
    }

    /**
     * 实名认证，即开通易宝
     */
    $scope.realNameAuth = function(user){
      if (!user.realName || !user.idNo){
        $scope.errMsg = '请输入姓名或身份证号';
      }
      $state.go('root.yeepay-transfer', {
        type: 'register',
        number: "null",
        realName: user.realName,
        idNo: user.idNo
      });
    }

    $scope.toRealNameAuth = false;
    $scope.openYeepay = function(){
      $scope.toRealNameAuth = true;
    }


    $scope.goWithdraw = function(){
      $state.go("root.user-center.withdraw");
    }

    $scope.goRecharge = function(){
      $state.go("root.user-center.recharge");
    }


    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '账户总览',
    }, {
      title: '我的投资'
    }];

    $scope.handleMobileNum = function(phoneNum) {
        if(phoneNum == null || phoneNum == 'undefined'){
            return null;
        }
        
      var _phoneNum = phoneNum.toString();
      var phoneNumArray = _phoneNum.split('')
      var num = phoneNumArray.length;
      var middleNum = Math.ceil((num-1) * 0.5);
      if (num >= 6) {
        phoneNumArray[middleNum] = '*'
        phoneNumArray[middleNum-1] = '*'
        phoneNumArray[middleNum+1] = '*'        
        phoneNumArray[middleNum-2] = '*'
        phoneNumArray[middleNum+2] = '*'
      };
      return phoneNumArray.join('')
    }    
    $scope.handleEmailAD = function(emailAD) {
        if(emailAD == null || emailAD == 'undefined'){
            return null;
        }

      var _emailAD = emailAD.toString();
      var emailHead = _emailAD.substr(0,_emailAD.indexOf('@'))
      var emailEnd = _emailAD.substr(_emailAD.indexOf('@'))
      var emailADArray = emailHead.split('')
      var num = emailADArray.length;
      var middleNum = Math.ceil((num-1) * 0.5);
      if (num >= 6) {
        emailADArray[middleNum] = '*'
        emailADArray[middleNum-1] = '*'
        emailADArray[middleNum+1] = '*'
      } else if (num === 5){
        emailADArray[middleNum] = '*'
        emailADArray[middleNum+1] = '*'
      } else if (num === 4){
        emailADArray[middleNum] = '*'
        emailADArray[middleNum-1] = '*'
      } else if (num === 3){
        emailADArray[middleNum] = '*'
      } else if (num === 2){
        emailADArray[middleNum] = '*'
      } else if (num === 1){
        return emailAD
      } 
      return emailADArray.join('') + emailEnd
    }
  });
