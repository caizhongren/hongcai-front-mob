/*
* @Author: yuyang
* @Date:   2016-08-31 09:58:58
* @Last Modified by:   yuyang
* @Last Modified time: 2016-09-19 10:27:53
* @Effect 密码的显示与隐藏功能
*/

'use strict';
angular.module('p2pSiteMobApp')
  .directive('selectEyes', function() {
    return {
      restrict: 'A',
      link : function(scope, element) {
          var eyes =true;
          var show = 'fa-eye';
          var hideen = 'fa-eye-slash';
          var password = element[0].parentNode.previousElementSibling;
          function select(){
            if(eyes){
              element.removeClass(hideen).addClass(show);
              password.setAttribute('type', 'text');
            }else {
              element.removeClass(show).addClass(hideen);
              password.setAttribute('type', 'password');
            }
            eyes = !eyes;
          }
          element.on('click', select);
      }
    };
  });
