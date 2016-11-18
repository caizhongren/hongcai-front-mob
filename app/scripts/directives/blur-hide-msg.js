'use strict';
angular.module('p2pSiteMobApp')
  .directive('blurHideMsg', function () {
    // var FOCUS_CLASS = 'ng-focused';
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ctrl) {
        ctrl.$focused = false;
        element.bind('blur', function() {
          // element.removeClass(FOCUS_CLASS);
          // scope.$apply(function() {ctrl.$focused = false;});
          scope.msg ? scope.msg = !scope.msg : scope.msg;
          scope.errMsg ? scope.errMsg = !scope.errMsg  : scope.errMsg;
        });
      }
    };
  })

