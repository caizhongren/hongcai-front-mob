'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AccountCtrl
 * @description
 * # UserCenterAccountCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('SettingsCtrl', function($scope, $rootScope, $state, md5, Utils, Restangular, WEB_DEFAULT_DOMAIN, $timeout, $location, toCunGuanUtils, SessionService, UserService, restmod) {
    
    if ($location.path().split('/')[2] === 'setting') {
      $rootScope.showFooter = false;
    }

    /**
     * 邀请码
     */
    $scope.voucher = Restangular.one('users/0').one('voucher').get().$object;

    /**
     * 认证信息
     */
    UserService.loadUserAuth($scope);

    /**
     * 银行卡信息
     */

    Restangular.one('users/0').one('bankcard').get().then(function(response) {
        $scope.simpleBankcard = response;
        if($scope.simpleBankcard.cardNo){
          $scope.simpleBankcard.cardNo = $scope.simpleBankcard.cardNo.substr($scope.simpleBankcard.cardNo.length - 4);
        }
    });


    /**
     * 绑定银行卡
     */
    $scope.bindBankcard = function() {
      if($scope.userAuth.authStatus !== 2) {
        $rootScope.toRealNameAuth();
        return;
      }
      toCunGuanUtils.to('BIND_BANK_CARD', null, null, null, null, null);
    }

    $scope.changePassword = function(oldP, newP1, newP2) {
      if (!oldP || !newP2 || !newP1) {
        return;
      }

      if (newP1 !== newP2) {
        $scope.changePasswordMsg = "两次密码输入不一致";
        return;
      }
      Restangular.one('users/0').post('changePassword', {
          oldPassword: md5.createHash(oldP),
          newPassword: md5.createHash(newP2),
          device: Utils.deviceCode()
        }).then(function(response) {
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

    /*
    *风险测评 结果
    */
    $scope.recentlyQuestionnaire = function() {
      Restangular.one('/users/' + '0' + '/recentlyQuestionnaire' ).get().then(function(response){
       $scope.isQuestionnaire = response.score2;
       if(response !== -1){
        if(response.score2 < 35){
          $scope.riskPreference = '保守型';
        }else if(response.score2 >= 35 && response.score2 <= 59){
          $scope.riskPreference = '稳健型';
        }else if(response.score2 > 59){
          $scope.riskPreference = '进取型';
        }else {
          $scope.riskPreference = '保守型';
        }
        
        $scope.msgRisk = '您的投资风格为' + $scope.riskPreference;
       }
      })
    };
    $scope.recentlyQuestionnaire();


    /*
    *自动投标详情
    */
    $scope.autoTendersDetail = function() {
      Restangular.one('/users/' + '0' + '/autoTender' ).get().then(function(response){
       $scope.autoTenders = response;
      })
    };
    $scope.autoTendersDetail();

    

    /**
     * 开通自动投标权限
     */
    $scope.toAutoTender = function() {
      
      if($scope.userAuth.authStatus !== 2) {
        $rootScope.toRealNameAuth();
        return;
      }
      if($scope.userAuth.autoTransfer) {
        $state.go('root.userCenter.autotender');
      } else {
        toCunGuanUtils.to('autoTransfer', null, null, null, null, null);
      }
    
    };


    /**
     * 退出登录功能
     */ 
    $scope.toLogout = function() {
      SessionService.destory();
      $state.go('root.login');
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

    //提交反馈意见
    $scope.busy = false;
    $scope.releaseComm = function(user){
      if($scope.busy){
        return;
      }
      if (!user) {
        return;
      }
      if (!user.textarea) {
        return;
      }
      
      if(user.mobile && user.mobile.toString().length !== 11){
        $rootScope.showMsg("手机号码格式不正确");
        return;
      }
      $scope.busy = true;
      var saveFeedback = restmod.model(WEB_DEFAULT_DOMAIN + "/feedback/saveFeedback?feedbackInfo="+ user.textarea +"&contackWay=" + user.mobile);
      saveFeedback.$create({}).$then(function(response) {
        if(response && response.ret !== -1){
          $timeout(function() {
            $scope.busy = false;
          }, 1000);
          $scope.closeRule();
          $rootScope.successMsg = '反馈成功！';
          $rootScope.showSuccessToast = true;
          $timeout(function() {
            $rootScope.showSuccessToast = false;
            $rootScope.successMsg = '';
          }, 2000);
        }else {
          $scope.showMask = true;
          $timeout(function() {
            $scope.busy = false;
          }, 1000);
        }
      })
    }
    //监测手机号位数 11位
    $scope.$watch('user.mobile', function(newVal, oldVal){
      if (newVal && newVal.toString().length >11) {
        $rootScope.showMsg("手机号码格式不正确");
      }
    })
    var scrollTop = 0;
    $scope.toComment = function(){
      // 在弹出层显示之前，记录当前的滚动位置
      scrollTop = getScrollTop();

      // 使body脱离文档流
      $('.setting').addClass('position-fix'); 

      // 把脱离文档流的body拉上去！否则页面会回到顶部！
      document.body.style.top = -scrollTop + 'px';
    }
    // 关闭弹窗
    $scope.closeRule = function(){
      $scope.showMask = false; 
      $scope.user = null;
      // body又回到了文档流中
      $('.setting').removeClass('position-fix');

      // 滚回到老地方！
      to(scrollTop);
    }
    function to(scrollTop){
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }
    function getScrollTop(){
      return document.body.scrollTop || document.documentElement.scrollTop;
    }


  });
