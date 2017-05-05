'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BindWechatCtrl
 * @description
 * # BindWechatCtrl
 * Controller of the p2pSiteMobApp
 */

angular.module('p2pSiteMobApp')
  .controller('BindWechatCtrl', function($scope, $rootScope, $state, $location, $timeout, checkPwdUtils, Restangular, md5) {
    $rootScope.showFooter = false;

    /**
    * 查询用户绑定信息
    **/
    
    Restangular.one('/activitys/isBindings').get({
        openId: $rootScope.openid
    }).then(function(response){
        if (!response || response.ret === -1) {
            return;
        }
        $scope.isBindWechat = response.bindingFlag;
    })

    //监测手机号码
    $scope.mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
    $scope.$watch('wechatUser.mobile', function(newVal) {
      if (newVal !== undefined) {
          var valLgth = newVal.toString().length;
          if (valLgth > 11 && !$scope.mobilePattern.test(newVal)) {
            $rootScope.showMsg('手机号码格式不正确');
          }
        }
    })
    //监控密码
    $scope.$watch('wechatUser.password', function(newVal) {
        checkPwdUtils.showPwd1(newVal);
    })
    //去注册
    $scope.toRegister = function() {
      if (!$rootScope.timeout) {
        return;
      }
      $state.go('root.register2', {redirectUrl: encodeURIComponent($location.url())});
      return;
    }
    /**
    * 绑定
    **/
    $scope.busy = false;
    $scope.toBind = function(wechatUser) {
        var passwordMsg = checkPwdUtils.showPwd2(wechatUser.password)
        if(!wechatUser.mobile || !wechatUser.password || $scope.busy) {
            return;
        }
        $scope.busy = true;
        if(!$scope.mobilePattern.test(wechatUser.mobile)) {
           $rootScope.showMsg('手机号码格式不正确');
           return; 
        }
        if(passwordMsg !== '') {
            $rootScope.showMsg(passwordMsg);
            return;
        }
        if($scope.isBindWechat){
           $state.go('root.bindWechat-status',{status:0}); 
           return;
        }

        Restangular.one('activitys/').post('wechatSubscriptionBinding',{
            mobile: wechatUser.mobile,
            password: md5.createHash(wechatUser.password),
            openId: $rootScope.openid
        }).then(function(response){
            
            if(!response || response.ret === -1){
                return;
            }
            $timeout(function(){
                $scope.busy = false;
            },500)
            $state.go('root.bindWechat-status',{status:1});
        })
        
        
    }
  });
