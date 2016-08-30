/*
* @Author: Administrator
* @Date:   2016-08-12 16:37:40
* @Last Modified by:   yuyang
* @Last Modified time: 2016-08-30 10:01:00
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('modifyPwd', function(checkPwdUtils, $timeout, $scope, restmod, DEFAULT_DOMAIN,md5, $state,$rootScope) {

    /**
     * 监测新密码
     */
    $scope.$watch('chg.newPassword1', function(newVal){
      if(newVal === undefined){
        return;
      }

      //调用checkPwdUtils，判断密码是否含非法字符
      checkPwdUtils.showPwd1(newVal);
    })

    /**
     * 监测确认密码
     */
    $scope.$watch('chg.newPassword2', function(newVal){
      if(newVal === undefined){
        return;
      }

      checkPwdUtils.eqPwd($scope.chg.newPassword1, $scope.chg.newPassword2);
    })

    /**
     * 确认修改密码
     */
    $scope.changePassword = function(chg) {

      //判断新密码与确认密码是否一致
      if(chg.newPassword1 !== chg.newPassword2){
        $rootScope.showMsg('两次密码输入不一致');
        return;
      }

      //判断新密码是否符合规则
      var msg = checkPwdUtils.showPwd2(chg.newPassword1);
      if(msg){
        return;
      }

      //判断旧密码是否正确
      restmod.model(DEFAULT_DOMAIN + '/users/' + '0' + '/changePassword')
      .$create({
        oldPassword: md5.createHash(chg.oldPassword),
        newPassword: md5.createHash(chg.newPassword1),
      }).$then(function(response) {
        if (response.ret === -1) {
          $rootScope.showMsg('旧密码不正确');
        } else {
          $state.go('root.login');
        }
      });

    }

  })
