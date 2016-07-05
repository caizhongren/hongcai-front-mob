'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('SettingsCtrl', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN, md5) {

    $scope.userHeadImgUrl = '/images/user-center/head.png';

    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      if ($rootScope.hasLoggedUser.headImgUrl){
        $scope.userHeadImgUrl = $rootScope.hasLoggedUser.headImgUrl
      }
      

      /**
       * 邀请码
       */
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/voucher').$then(function(response) {
          $scope.voucher = response;
      });

      HongcaiUser.$find($rootScope.hasLoggedUser.id).$then(function(response) {
         console.log(response);
      });

    });

    $scope.changePassword = function(oldP, newP1, newP2){
      if (!oldP || !newP2 || !newP1){
        return;
      }

      if (newP1 !== newP2){
        $scope.changePasswordMsg = "两次密码输入不一致";
        return;
      }

      restmod.model(DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.id + '/changePassword')
      .$create({
        oldPassword: md5.createHash(oldP),
        newPassword: md5.createHash(newP2)
      }).$then(function(response){
        if (response.ret === -1){
          $scope.changePasswordMsg = response.msg;
        } else {
          $scope.checkPwdFlag = false;
          $scope.oldPassword = null;
          $scope.newPassword1 = null;
          $scope.newPassword2 = null;
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
     * 修改手机号码（针对已绑定手机号）
     */
     $scope.resetMobile = function(mobileNum){
      console.log(mobileNum);
      $state.go('root.yeepay-transfer', {
        type: 'RESET_MOBILE',
        number: mobileNum
      });
     }


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
