'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('SettingsCtrl', function($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN, md5) {

    $scope.userHeadImgUrl = '/images/user-center/head.png';

    $rootScope.checkSession.promise.then(function() {
      if (!$rootScope.isLogged) {
        $state.go('root.login');
      }

      if ($rootScope.hasLoggedUser.headImgUrl) {
        $scope.userHeadImgUrl = $rootScope.hasLoggedUser.headImgUrl
      }
    });

    /**
     * 邀请码
     */
    $scope.voucher = HongcaiUser.$find('0' + '/voucher').$then();


    /**
     * 银行卡信息
     */
    HongcaiUser.$find('0' + '/bankcard').$then(function(response) {
        $scope.simpleBankcard = response;
        if($scope.simpleBankcard.cardNo){
          $scope.simpleBankcard.cardNo.substr($scope.simpleBankcard.cardNo.length - 4);
        }
    });


    /**
     * 绑定银行卡
     */
    $scope.bindBankcard = function() {
      $state.go('root.yeepay-transfer', {
        type: 'BIND_BANK_CARD'
      });
    }

    $scope.changePassword = function(oldP, newP1, newP2) {
      if (!oldP || !newP2 || !newP1) {
        return;
      }

      if (newP1 !== newP2) {
        $scope.changePasswordMsg = "两次密码输入不一致";
        return;
      }

      restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/changePassword')
        .$create({
          oldPassword: md5.createHash(oldP),
          newPassword: md5.createHash(newP2)
        }).$then(function(response) {
          if (response.ret === -1) {
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
    $scope.toAuthAutoTransfer = function() {
      $state.go('root.yeepay-transfer', {
        type: 'autoTransfer',
        number: "null"
      });
    }

    /**
     * 修改手机号码（针对已绑定手机号）
     */
    $scope.resetMobile = function(mobileNum) {
        console.log(mobileNum);
        $state.go('root.yeepay-transfer', {
          type: 'RESET_MOBILE',
          number: mobileNum
        });
      }
      // 退出登录功能
    $scope.toLogout = function() {
      if ($rootScope.hasLoggedUser) {
        // TODO  登出的model在这里不太好吧。
        var logoutModel = restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/logout');
        logoutModel.$create().$then(function(response) {
          if (response.ret === 1) {
            $rootScope.hasLoggedUser = null;
            $rootScope.isLogged = false;
            $state.go('root.login');
          }
        });
      }
    };

    $scope.handleMobileNum = function(phoneNum) {
      if (phoneNum == null || phoneNum == 'undefined') {
        return null;
      }

      var _phoneNum = phoneNum.toString();
      var phoneNumArray = _phoneNum.split('')
      var num = phoneNumArray.length;
      var middleNum = Math.ceil((num - 1) * 0.5);
      if (num >= 6) {
        phoneNumArray[middleNum] = '*'
        phoneNumArray[middleNum - 1] = '*'
        phoneNumArray[middleNum + 1] = '*'
        phoneNumArray[middleNum - 2] = '*'
        phoneNumArray[middleNum + 2] = '*'
      };
      return phoneNumArray.join('')
    }
    $scope.handleEmailAD = function(emailAD) {
      if (emailAD == null || emailAD == 'undefined') {
        return null;
      }

      var _emailAD = emailAD.toString();
      var emailHead = _emailAD.substr(0, _emailAD.indexOf('@'))
      var emailEnd = _emailAD.substr(_emailAD.indexOf('@'))
      var emailADArray = emailHead.split('')
      var num = emailADArray.length;
      var middleNum = Math.ceil((num - 1) * 0.5);
      if (num >= 6) {
        emailADArray[middleNum] = '*'
        emailADArray[middleNum - 1] = '*'
        emailADArray[middleNum + 1] = '*'
      } else if (num === 5) {
        emailADArray[middleNum] = '*'
        emailADArray[middleNum + 1] = '*'
      } else if (num === 4) {
        emailADArray[middleNum] = '*'
        emailADArray[middleNum - 1] = '*'
      } else if (num === 3) {
        emailADArray[middleNum] = '*'
      } else if (num === 2) {
        emailADArray[middleNum] = '*'
      } else if (num === 1) {
        return emailAD
      }
      return emailADArray.join('') + emailEnd
    }
  });
