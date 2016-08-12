/*
* @Author: Administrator
* @Date:   2016-08-12 16:37:40
* @Last Modified by:   Administrator
* @Last Modified time: 2016-08-12 19:01:07
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('modifyPwd', function($timeout, $scope, restmod, DEFAULT_DOMAIN,md5) {

    var pwd_regexp = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
    var pwd_regexp2 = /^[^~!@#$%^&*]+$/;
    $scope.$watch('chg.newPassword1', function(oldVal){
      $scope.mobileShow = false;
      if(oldVal !== undefined){
        $scope.msg = '';
        var valLgth1 = oldVal.toString().length;
        $scope.valLgth1 = valLgth1;
        if(!pwd_regexp2.test(oldVal)){
          $scope.mobileShow = true;
          $scope.msg = '密码含非法字符';
          $scope.showMsg();
        }else if(valLgth1 >16){
          $scope.mobileShow = true;
          $scope.msg = '密码6-16位，需包含字母和数字';
          $scope.showMsg();
        }
      }
    })

    $scope.$watch('chg.newPassword2', function(oldVal){
      $scope.mobileShow = false;
      if(oldVal !== undefined){
        $scope.msg = '';
        var valLgth2 = oldVal.toString().length;
        if(valLgth2 >= $scope.valLgth1 && $scope.newPassword1 !== $scope.newPassword2){
          $scope.msg = '两次密码输入不一致';
          $scope.mobileShow = true;
          $scope.showMsg();
        }
      }
    })
    $scope.changePassword = function(chg) {
      var pwd_regexp1 = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
        $scope.msg = '';
        if(chg.newPassword1 !== chg.newPassword2){
          $scope.mobileShow = true;
          $scope.msg = '两次密码输入不一致';
          $scope.showMsg();
          return;
        }

        if(!pwd_regexp1.test(chg.newPassword1)){
          $scope.mobileShow = true;
          $scope.msg = '密码6-16位，需包含字母和数字';
          $scope.showMsg();
          return;
        }

      restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/changePassword')
          .$create({
            oldPassword: md5.createHash(chgs.oldPassword),
          }).$then(function(response) {
            if (response.ret === -1) {
              $scope.msg = '旧密码不正确';
              $scope.mobileShow = true;
              $scope.showMsg();
            } else {
              $scope.showErrorMsg = false;
              $scope.oldPassword = null;
              $scope.newPassword1 = null;
              $scope.newPassword2 = null;
            }

      });

    }

    //设置错误提示
    $scope.showErrorMsg = false;
    $scope.showMsg = function(){
      $scope.showBtn = true;
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
  })
