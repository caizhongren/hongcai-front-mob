/*
* @Author: Administrator
* @Date:   2016-08-12 16:37:40
* @Last Modified by:   Administrator
* @Last Modified time: 2016-08-15 10:44:34
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('modifyPwd', function($timeout, $scope, restmod, DEFAULT_DOMAIN,md5) {

    $scope.showErrorMsg = false;
    var pwd_regexp = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
    var pwd_regexp2 = /^[^~!@#$%^&*]+$/;
    $scope.$watch('chg.newPassword1', function(oldVal){
      // $scope.mobileShow = false;
      if(oldVal !== undefined){
        $scope.msg = '';
        var valLgth1 = oldVal.toString().length;
        $scope.valLgth1 = valLgth1;
        if(!pwd_regexp2.test(oldVal)){
          $scope.msg = '密码含非法字符';
          $scope.showErrorMsg = true;
          $scope.showMsg();
        }else if(valLgth1 >16){
          $scope.msg = '密码6-16位，需包含字母和数字';
          $scope.showErrorMsg = true;
          $scope.showMsg();
        }
        $scope.showBtn = $scope.msg === '' ?false : true;
      }
    })

    $scope.$watch('chg.newPassword2', function(oldVal){
      $scope.mobileShow = false;
      if(oldVal !== undefined){
        $scope.msg = '';
        var valLgth2 = oldVal.toString().length;
        if(valLgth2 >= $scope.valLgth1 && $scope.chg.newPassword1 !== $scope.chg.newPassword2){
          $scope.msg = '两次密码输入不一致';
          $scope.showErrorMsg = true;
          $scope.showMsg();
        }
        $scope.showBtn = $scope.msg === '' ?false : true;
      }
    })

    if($scope.msg ==='旧密码不正确'){
      $scope.$watch('chg.oldPassword', function(newVal, oldVal){
        console.log(1);
        if(newVal !==oldVal){
          $scope.showBtn = false;
        }
      })
    }

    $scope.changePassword = function(chg) {
      var pwd_regexp1 = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
      $scope.msg = '';
      if(chg.newPassword1 !== chg.newPassword2){
        $scope.msg = '两次密码输入不一致';
        $scope.showErrorMsg = true;
        $scope.showMsg();
        return;
      }

      if(!pwd_regexp1.test(chg.newPassword1)){
        $scope.msg = '密码6-16位，需包含字母和数字';
        $scope.showErrorMsg = true;
        $scope.showMsg();
        return;
      }

      restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/changePassword')
      .$create({
        oldPassword: md5.createHash(chg.oldPassword),
      }).$then(function(response) {
        if (response.ret === -1) {
          $scope.msg = '旧密码不正确';
          $scope.showErrorMsg = true;
          $scope.showBtn = $scope.msg === '' ?false : true;
          $scope.showMsg();
        } else {
          $scope.showErrorMsg = false;
          $scope.oldPassword = null;
          $scope.newPassword1 = null;
          $scope.newPassword2 = null;
        }

      });

      $scope.$watch('chg.oldPassword', function(newVal, oldVal){
        if(newVal !==oldVal){
          if($scope.msg ==='旧密码不正确'){
          console.log(1);
            $scope.showBtn = false;
          }
        }
      })
    }
    $scope.showMsg = function(){
      $timeout(function() {
          $scope.showErrorMsg = false;
          $scope.showBtn = true;
        }, 3000);
    }
  })
