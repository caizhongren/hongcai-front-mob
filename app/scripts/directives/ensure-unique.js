'use strict';

/**
 * @ngdoc directive
 * @name p2pSiteMobApp.directive:ensureUnique
 * @description
 * # ensureUnique
 */
angular.module('p2pSiteMobApp')
  .directive('ensureUnique', ['isEnsureUnique', function (isEnsureUnique) {
    return {
      restrict: 'AE',
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        scope.$watch(attrs.ngModel, function() {
          console.log(elem.val());
          var uniqueValue = elem.val();
          if(uniqueValue !== '') {
            isEnsureUnique.$create({account: uniqueValue}).$then(function(response) {
              console.log(response);
              if (response.ret === -1) {
                ctrl.$setValidity('unique', true);
              } else if (response.ret === 1) {
                ctrl.$setValidity('unique', false);
              }
            });
          }
        });
      }
    };
  }]);
