'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AssignmentsTransferCtrl
 * @description
 * # AssignmentsTransferCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AssignmentsTransferCtrl', function(config, Restangular, $scope, $rootScope, $state, $stateParams, HongcaiUser, restmod, WEB_DEFAULT_DOMAIN) {
    var num = $stateParams.number;
    // /hongcai/rest/creditRights/979022016111516405657758/creditDetail
    //localhost:8100/hongcai/rest/assignments/assignmentRule
    /*
    *获取债券认购规则
    */
    Restangular.one('assignments/assignmentRule').get().then(function(response){

    });
    /*
    *获取债券详情
    */
    Restangular.one('creditRights/'+ num + '/creditDetail').get().then(function(response){
      if(response && response.ret !==-1) {
        $scope.creditRight = response.creditRight;
      }
    });

  });
