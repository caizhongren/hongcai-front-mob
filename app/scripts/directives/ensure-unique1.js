'use strict';

/**
 * @ngdoc directive
 * @name o2oWechatIou.directive:ensureUnique
 * @description
 * # ensureUnique
 */
angular.module('p2pSiteMobApp')
  .directive('ensureUnique', function (isEnsureUnique) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModelCtrl) {
        scope.$watch(attrs.ngModel, function() {
          var uniqueValue = elem.val();
          if(uniqueValue !== '') {
            isEnsureUnique.$create({account: uniqueValue}).$then(function(response) {
              if (response.ret === -1) {
                ngModelCtrl.$setValidity('unique', false);
              } else if (response.ret === 1) {
                ngModelCtrl.$setValidity('unique', true);
              }
            });
          }
        });
      }
    };
  });