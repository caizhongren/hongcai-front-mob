/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:HelpCenterCtrl
 * @description
 * # HelpCenterCtrl
 * Controller of the p2pSiteMobApp
 */
'use strict';
angular.module('p2pSiteMobApp')
  .controller('HelpCenterCtrl', function($state, DateUtils, $stateParams, Restangular, $scope, $rootScope) {
    $rootScope.showFooter = false;

    $rootScope.migrateStatus();

  });
