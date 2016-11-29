'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SecuritySettingsCtrl
 * @description
 * # SecuritySettingsCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('SecuritySettingsCtrl', function ($scope, $state, DEFAULT_DOMAIN, Restangular) {
  $scope.showDateLimit = false;
  $scope.showAnnual = false;
  $scope.showType = false;
  $scope.toggle = {};
  $scope.toggle.dateList = ['30','60','90','120','180','360','不限'];
  $scope.toggle.annualList = ['7','8','9','10','11','12','不限'];
  $scope.toggle.typeList = ['宏金保','债权转让','不限'];
  $scope.selectedDate = $scope.selectedDate? $scope.selectedDate : '不限';
  $scope.selectedAnnual = $scope.selectedAnnual? $scope.selectedAnnual : '不限';
  $scope.selectedType = $scope.selectedType? $scope.selectedType : '不限';
  $scope.selectDate = function(date) {
    $scope.selectedDate = null;
    $scope.selectedDate = date;
    $scope.showAnnual = false;
    $scope.showType = false;
  }
  $scope.selectAnnual = function(annual) {
    $scope.selectedAnnual = null;
    $scope.selectedAnnual = annual;
    $scope.showDateLimit = false;
    $scope.showType = false;
  }
  $scope.selectType = function(type) {
    $scope.selectedType = null;
    $scope.selectedType = type;
    $scope.showDateLimit = false;
    $scope.showAnnual = false;
  }

});