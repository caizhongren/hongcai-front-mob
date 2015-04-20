'use strict';

/**
 * @ngdoc directive
 * @name p2pSiteMobApp.directive:ensureUnique
 * @description
 * # ensureUnique
 */
angular.module('p2pSiteMobApp')
  .directive('ensureUnique', ['$scope', 'isEnsureUnique',function ($scope, isEnsureUnique) {
    return {
      restrict: 'AE',
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl){
        // 获取unique的类型{account|mobile|email}
        var uniqueKey = attrs.ensureUnique;
        var uniqueValue = angular.element('#' + attrs.ensureUnique).val();
        if (uniqueKey !== '') {
          isEnsureUnique.$create({uniqueKey: uniqueValue}).$then(function(response) {
            // if () {
            //   ctrl.$setValidity('unique', true);
            // } else if () {
            //   ctrl.$setValidity('unique', false);
            // }
          });
        }
      }
    };
  }]);
