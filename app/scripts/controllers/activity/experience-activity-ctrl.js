'use strict';

angular.module('p2pSiteMobApp')
  .controller('ExperienceActivityCtrl', function($rootScope, $scope, $state, $stateParams) {
    
    $scope.number = $stateParams.number;
    $scope.imgSrc = "/images/activity/activity0071.png";

    if ($scope.number === "1") {
      $scope.imgSrc = "/images/activity/activity0071.png";
      $scope.moneyTest = "2000";
    } else if ($scope.number === "2") {
      $scope.imgSrc = "/images/activity/activity0072.png";
      $scope.moneyTest = "4000";
    }


  });
