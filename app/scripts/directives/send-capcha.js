/*
 * @Author: fuqiang1
 * @Date:   2016-08-31 09:56:54
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-09-01 17:34:50
 */

'use strict';
angular.module('p2pSiteMobApp')
  .directive('sendCapcha', function($http, Restangular, ipCookie, Utils, $location, DEFAULT_DOMAIN, $rootScope) { //定义指令时的名称用驼峰命名，使用时用中划线方式
    return {
      restrict: 'EA',
      scope: true,
      require: 'ngModel',
      link: function(scope, elem, attrs) {
        var mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
        function capchaCountdown() {
          if(!scope.user.mobile || !scope.user.picCaptcha){
            return;
          }
          if(!mobilePattern.test(scope.user.mobile)){
            // msg = '手机号码格式有误';
            // $rootScope.showMsg('手机号码格式有误');
            return
          }else {
            //校验手机号
            Restangular.one('/users/').post('isUnique', {
              account: scope.user.mobile
            }).then(function(response) {
              if(response && response.ret === -1) {
                $rootScope.showMsg('已经注册过，去APP');
                return;
              }
              //校验图形验证码
              $http({
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                url: DEFAULT_DOMAIN + '/captchas/checkPic',
                data: {'captcha': scope.user.picCaptcha}
              }).success(function(data) {
                if (data == true) {
                  var second = 60;
                  // 如果秒数还是大于0，则表示倒计时还没结束
                  function countDown() {
                    // 如果秒数还是大于0，则表示倒计时还没结束
                    if (second >= 0) {
                      // 倒计时不结束按钮不可点
                      attrs.$$element[0].disabled = true;
                      elem[0].innerHTML = null;
                      elem[0].innerHTML = second + "s";
                      elem[0].className = '';
                      // 时间减一
                      second -= 1;
                      // 一秒后重复执行
                      setTimeout(function() {
                        countDown(elem[0]);
                      }, 1000);
                      // 否则，按钮重置为初始状态,可点击
                    } else {
                      elem[0].className = '';
                      elem[0].innerHTML = "重新发送";
                      second = 60;
                      attrs.$$element[0].disabled = false;
                    }

                  }
                  countDown();
                } else {
                  $rootScope.showMsg(data.msg);
                }
              }).error(function() {
                $rootScope.showMsg('图形验证码错误');
              });
            })
          }
        }
        elem.on('click', capchaCountdown);
      }
    }
  })
