/*
* @Author: fuqiang1
* @Date:   2016-09-22 15:50:26
* @Last Modified by:   fuqiang1
* @Last Modified time: 2016-09-24 11:12:43
*/

'use strict';
/**
 * 修改手机号码（针对已绑定手机号）
 */
 angular.module('p2pSiteMobApp')
   .controller('resetMobileCtrl', function(checkPwdUtils, $rootScope, $scope, $state, $http, CheckMobUtil, CheckPicUtil, md5, register, wechat, mobileCaptcha, HongcaiUser, Restangular){
      //图形验证码
      $scope.getPicCaptcha = '/hongcai/api/v1/siteUser/getPicCaptcha?';
      $scope.refreshCode = function() {
        angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
      };

    /**
     * 校验用户手机号
     */
      $scope.$watch('user.mobile', function(newVal) {
          CheckMobUtil.checkMob(newVal);
        })
      /**
       * 校验图形验证码
       */
      $scope.$watch('user.picCaptcha', function(newVal) {
        $rootScope.msg = '';
        CheckPicUtil.checkePic(newVal);
        if ($rootScope.msg) {
          $scope.piccha = false;
        } else {
          $scope.piccha = true;
        }
      })

    /**
     * 确认修改手机号
     */
      $scope.resetMobile = function(mobile, captcha, picCaptcha) {
        if (!mobile || !captcha || !picCaptcha) {
          return;
        }

        //判断手机号码
        if (!$rootScope.mobilePattern.test(mobile)) {
          $rootScope.showMsg('手机号码格式不正确');
          return;
        }

        if ($scope.piccha == false || picCaptcha.toString().length !== 4) {
          $rootScope.showMsg('图形验证码有误');
          return;
        }
        //控制短信验证码输入又删除按钮状态
        $scope.$watch('user.captcha', function(newVal, oldVal) {
          $scope.sendMsg = true;
          if (!newVal || newVal == undefined) {
            $scope.sendMsg = false;
          }
        })


        //判断手机号是否被占用,短信验证码是否正确
        Restangular.one('/users/').one('0/').post('resetMobile', {
          mobile: mobile,
          captcha: captcha
        }).then(function(response) {
          if(response.ret === -1){
            $rootScope.showMsg(response.msg);
            return;
          }else{
            $state.go('root.userCenter.setting');
            $rootScope.showMsg("修改成功！");
          }
        })
      }

   })

