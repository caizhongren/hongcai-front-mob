/*
* @Author: Administrator
* @Date:   2016-08-12 16:37:40
* @Last Modified by:   yuyang
* @Last Modified time: 2016-08-29 11:17:30
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('modifyPwd', function($timeout, $scope, restmod, DEFAULT_DOMAIN,md5, $state,$rootScope) {

    var pwd_regexp = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
    var pwd_regexp2 = /^[^~!@#$%^&*]+$/;

    /**
     * 监测新密码
     */
    $scope.$watch('chg.newPassword1', function(newVal){
      if(newVal === undefined){
        return;
      }
      $scope.msg = '';
      var valLgth1 = newVal.toString().length;
      $scope.valLgth1 = valLgth1;
      if(!pwd_regexp2.test(newVal)){
        $scope.msg = '密码含非法字符';
        $rootScope.showMsg($scope.msg);
      }else if(valLgth1 >16){
        $scope.msg = '密码6-16位，需包含字母和数字';
        $rootScope.showMsg($scope.msg);
      }
    })

    /**
     * 监测确认密码
     */
    $scope.$watch('chg.newPassword2', function(newVal){
      if(newVal === undefined){
        return;
      }
      $scope.msg = '';
      var valLgth2 = newVal.toString().length;
      if(valLgth2 >= $scope.valLgth1 && $scope.chg.newPassword1 !== $scope.chg.newPassword2){
        $scope.msg = '两次密码输入不一致';
        $rootScope.showMsg($scope.msg);
      }
    })

    /**
     * 确认修改密码
     */
    $scope.changePassword = function(chg) {
      var pwd_regexp1 = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
      $scope.msg = '';

      //判断新密码与确认密码是否一致
      if(chg.newPassword1 !== chg.newPassword2){
        $scope.msg = '两次密码输入不一致';
        $rootScope.showMsg($scope.msg);
        return;
      }

      //判断新密码是否符合规则
      if(!pwd_regexp1.test(chg.newPassword1)){
        $scope.msg = '密码6-16位，需包含字母和数字';
        $rootScope.showMsg($scope.msg);
        return;
      }

      //判断旧密码是否正确
      restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/changePassword')
      .$create({
        oldPassword: md5.createHash(chg.oldPassword),
        newPassword: md5.createHash(chg.newPassword1),
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = '旧密码不正确';
          $rootScope.showMsg($scope.msg);
        } else {
          $scope.oldPassword = null;
          $scope.newPassword1 = null;
          $scope.newPassword2 = null;
        }
        if($scope.msg ===''){
          $state.go('root.login');
        }
      });

    }

  })
