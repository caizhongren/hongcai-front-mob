/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AssignmentDetailCtrl
 * @description
 * # AssignmentDetailCtrl
 * Controller of the p2pSiteMobApp
 */
'use strict';
angular.module('p2pSiteMobApp')
  .controller('AssignmentDetailCtrl', function($stateParams, Restangular, $scope, $rootScope) {
    var number = $stateParams.number; 
    
    /**
     * 债权转让信息详情
     */
    Restangular.one('assignments').one(number).get({}).then(function(response) {
      if(response && response.ret !== -1) {
        $scope.assignment = response; 
        $scope.currentStock = response.currentStock;
        $scope.projectNumber = response.projectNumber; 
      }
    });
    
    $scope.assignmentInvestAmount = 1000;
    //监测投资金额
    $scope.$watch('assignmentInvestAmount', function(newVal, oldVal){
      if(!$rootScope.isLogged){
        return;
      }

      if(newVal !== oldVal){
        $scope.msg = undefined;
      }

      if($rootScope.account.balance <= 0){
        $scope.msg = '账户余额不足，请先充值';
      }

      if(newVal){
        if(newVal > $scope.currentStock *100){
          $scope.msg = '投资金额必须小于' + $scope.currentStock *100;
        }else if(newVal > $rootScope.account.balance){
          $scope.msg = '账户余额不足，请先充值';
        } else if(newVal < 100 ){
          $scope.msg = '投资金额必须大于100';
        } else if(newVal % 100 !==0 ){
          $scope.msg = '投资金额必须为100的整数倍';
        }
      }

      $scope.showMsg();
    });

    /**
     * 修改投资金额
     */
    $scope.modInvestAmout = function(offset,$event){
      $event.stopPropagation();
      $scope.assignmentInvestAmount = $scope.assignmentInvestAmount ? $scope.assignmentInvestAmount + offset : offset;
      $scope.assignmentInvestAmount = $scope.assignmentInvestAmount < 100 ? 100 : $scope.assignmentInvestAmount;
    }
    /**
     * 加载更多
     */
    


  });
