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
      link: function(scope, elem, attrs) {
        var second = 60;
        console.log(scope.canGetMobileCapcha);
        function countDown() {
          // 如果秒数还是大于0，则表示倒计时还没结束
          if(!scope.canGetMobileCapcha){
            return;
          }
          if (second >= 0) {
            // 倒计时不结束按钮不可点
            attrs.$$element[0].disabled = true;
            elem[0].innerHTML = null;
            elem[0].innerHTML = second + "s";
            elem[0].className = 'sent';
            // 时间减一
            second -= 1;
            // 一秒后重复执行
            setTimeout(function() {
              countDown(elem[0]);
            }, 1000);
            // 否则，按钮重置为初始状态,可点击
          } else {
            elem[0].className = 'sent';
            elem[0].innerHTML = "重新发送";
            second = 60;
            attrs.$$element[0].disabled = false;
          }

        }
        elem.on('click', countDown);
      }
    }
  })
