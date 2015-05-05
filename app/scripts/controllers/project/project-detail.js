'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectDetailCtrl
 * @description
 * # ProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectDetailCtrl', ['$scope', '$stateParams', 'projects', function ($scope, $stateParams, projects) {
    // 宏金保详情页面
    var number = $stateParams.number;
    // if (!number) {
    //   $state.go('root.project-list');
    // }
    // simple project
    $scope.simpleProject = projects.$find(number);
  }]);
