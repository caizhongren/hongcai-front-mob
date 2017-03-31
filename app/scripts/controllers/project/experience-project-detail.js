'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ExperienceProjectDetailCtrl
 * @description
 * # ExperienceProjectDetailCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ExperienceProjectDetailCtrl', function($scope, $state, $rootScope, $stateParams, $location, projects, Restangular, restmod, DEFAULT_DOMAIN, HongcaiUser, UserService) {


    UserService.loadAccount($scope);

    Restangular.one('projects').one('experienceProject').get().then(function(response) {
      if(response.ret === -1){
          alert(response.msg);
          $state.go('root.userCenter.account-overview');
        }

        $scope.experienceProject = response;
    });

    $scope.useExperience = false;
    $scope.quickInvest = function(){
      $scope.useExperience = true;
    }

    $scope.showMsg = false;
    $scope.toInvest = function() {
      $scope.useExperience = false;
      restmod.model(DEFAULT_DOMAIN + '/projects/' + $scope.experienceProject.number + '/users/' + '0' + '/investmentByExperience').$create({
        amount: $scope.userAccount.experienceAmount,
        projectId: $scope.experienceProject.id,
        isRepeat: 2,
        payAmount : 0,
        couponNumber : ""
      }).$then(function(response) {
        // 重复下单后，response.number为undefined
        if (response.$status === 'ok') {
          if (response.number !== null && response.number !== undefined) {
            $state.go('root.yeepay-callback', {
              business: 'EXPERIENCE',
              status: 'SUCCESS',
              amount: response.amount
            });
          } else if (response.ret === -1) {
            $scope.showMsg = true;
            $scope.msg = response.msg;
          }
        } else {
          $scope.msg = "服务器累瘫了，请稍后访问。";
        }
      })
    };
  });
