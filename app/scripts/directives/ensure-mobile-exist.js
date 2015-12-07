'use strict';

/**
 * @ngdoc directive
 * @name p2pSiteMobApp.directive:ensureUnique
 * @description
 * # ensureUnique
 */
angular.module('p2pSiteMobApp')
  .directive('ensureMobileExist', function (isEnsureUnique) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModelCtrl) {
        scope.$watch(attrs.ngModel, function() {
          var uniqueValue = elem.val();
          if(uniqueValue !== '') {
            isEnsureUnique.$create({account: uniqueValue}).$then(function(response) {
              if (response.ret === -1) {
                ngModelCtrl.$setValidity('unique', true);
              } else if (response.ret === 1) {
                ngModelCtrl.$setValidity('unique', false);
              }
            });
          }
        });
      }
    };
  });