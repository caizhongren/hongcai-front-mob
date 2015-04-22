'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:FundsProjectDetailCtrl
 * @description
 * # FundsProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('FundsProjectDetailCtrl', ['$scope', '$stateParams', 'fundsProjects', function ($scope, $stateParams, fundsProjects) {
    // 宏金盈详情页面
    var number = $stateParams.number;
    if (!number) {
      $state.go('root.project-list');
    }
    // simple project
    $scope.simpleFundsProject = fundsProjects.find(number);
  }]);
