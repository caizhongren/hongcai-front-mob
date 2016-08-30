/*
* @Author: yuyang
* @Date:   2016-08-29 14:13:07
* @Last Modified by:   yuyang
* @Last Modified time: 2016-08-30 09:49:24
*/

'use strict';
angular.module('p2pSiteMobApp')
  .factory('checkPwdUtils', function($rootScope) {
    var pwdIllegal_regexp = /^[^~!@#$%^&*]+$/;
    var pwd_regexp1 = /^(?=.*\d)(?=.*[a-zA-Z]).{6,16}$/;
    return {
      showPwd1: function(newVal){
        var msg ='';
        var valLgth1 = newVal.toString().length;
        if (!pwdIllegal_regexp.test(newVal)) {
          msg = '密码含非法字符';
          $rootScope.showMsg(msg);
        } else if (valLgth1 > 16) {
          msg = '密码6-16位，需包含字母和数字';
          $rootScope.showMsg(msg);
        }
      },
      showPwd2: function(newVal){
        var msg ='';
        var valLgth2 = newVal.toString().length;
        if(!pwdIllegal_regexp.test(newVal)){
          msg = '密码含非法字符';
          $rootScope.showMsg(msg);
        }else if (!pwd_regexp1.test(newVal)) {
          msg = '密码6-16位，需包含字母和数字';
          $rootScope.showMsg(msg);
        }
        return msg;
      },
      eqPwd: function(pwd1, pwd2){
        var msg ='';
        if(pwd2.length >= pwd1.length && pwd1 !== pwd2){
          msg = '两次密码输入不一致';
          $rootScope.showMsg(msg);
        }
      }
    }

  })
