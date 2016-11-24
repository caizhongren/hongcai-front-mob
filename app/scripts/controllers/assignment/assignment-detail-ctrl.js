/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AssignmentDetailCtrl
 * @description
 * # AssignmentDetailCtrl
 * Controller of the p2pSiteMobApp
 */
'use strict';
angular.module('p2pSiteMobApp')
  .controller('AssignmentDetailCtrl', function($state, DateUtils, $stateParams, Restangular, $scope, $rootScope, Utils) {
    var number = $stateParams.number; 

    /**
     * 债权转让信息详情
     */
    $scope.msg = '';
    Restangular.one('assignments').one(number).get({}).then(function(response) {
      if(response && response.ret !== -1) {
        $scope.assignment = response; 
        $scope.assignmentNum = $scope.assignment.number; 
        $scope.currentStock = response.currentStock;
        $scope.projectNumber = response.projectNumber;
        $scope.annual = response.annualEarnings; 
        $scope.originalAnnual = response.originalAnnualEarnings;
        $scope.remainDay = response.remainDay;
       //原项目还款计划
        Restangular.one('projects/'+$scope.projectNumber+'/projectBills').get({}).then(function(response){
          if(response && response.ret !==-1) {
            $scope.projectBills = response;
            $scope.latestProjectBill;
            for(var i= 0; i< response.length; i++) {
              if(response[i].status === 0) {
                $scope.latestProjectBill = response[i];
                break;
              }
            }
            $scope.lastRepayDay = $scope.latestProjectBill.lastRepaymentTime;
            var minBalanceAccount = $rootScope.account.balance - $rootScope.account.balance % 100;
            var minInvestAccount = $scope.currentStock * 100;
            $scope.assignmentInvestAmount = $rootScope.account.balance <= 100 ? '' : minBalanceAccount <= minInvestAccount ? minBalanceAccount : minInvestAccount;
            //监测投资金额
            $scope.$watch('assignmentInvestAmount', function(newVal, oldVal){
              if(!$rootScope.isLogged || $scope.currentStock <=0){
                return;
              }

              if(newVal !== oldVal){
                $scope.msg = undefined;
              }

              if(newVal){
                if(newVal >  $rootScope.account.balance || (newVal <= $rootScope.account.balancenewVal && $rootScope.account.balancenewVal < $scope.realPayAmount)){
                  $scope.msg = '账户余额不足，请先充值';
                }else if(newVal % 100 !==0 ){
                  $scope.msg = '投资金额必须为100的整数倍';
                }else if(newVal > $scope.currentStock *100){
                  $scope.msg = '投资金额必须小于' + $scope.currentStock *100;
                }else if(newVal < 100 ){
                  $scope.msg = '投资金额必须大于100';
                }
              }
              $rootScope.showMsg($scope.msg);
              //上次还款到认购当日的天数
              var lastPayDays = DateUtils.intervalDays(new Date().getTime(), $scope.lastRepayDay) * (new Date().getTime() > $scope.lastRepayDay ? 1 : -1); 
              var reward = ($scope.annual - $scope.originalAnnual) * newVal * $scope.remainDay / 36500;
              //  代收未收利息
              $scope.exProfit = newVal * $scope.originalAnnual * lastPayDays / 36500;
              //实际支付金额
              $scope.realPayAmount = newVal + $scope.exProfit - reward;
              //待收利息
              $scope.profit = newVal * $scope.remainDay * $scope.annual / 36500;

            });
          }
        });
      }
    });

    $rootScope.tofinishedOrder();
    /**
     * 下单并支付
     */
    $scope.clicked = true;
    $scope.toInvest = function(assignmentNum, assignmentAmount) {
      $scope.clicked = false;
      if($scope.msg || !assignmentNum || !assignmentAmount){
        return;
      }

      $rootScope.showMsg($scope.msg);
      $rootScope.tofinishedOrder();
      $rootScope.showLoadingToast = true;
      Restangular.one('assignments/' + assignmentNum + '/orders' + '?amount=' + assignmentAmount).post('', {
        amount: assignmentAmount,
        device: Utils.deviceCode()
      }).then(function(order){
        $rootScope.showLoadingToast = false;
        $scope.clicked = true;
        // 重复下单后，response.number为undefined
        if (order && order.ret !== -1) {
          $state.go('root.yeepay-transfer', {
            type: 'transfer',
            number: order.number
         });
        } else {
          $scope.msg = order.msg;
          $rootScope.showMsg($scope.msg);
        }
      });
    };

    /**
     * 修改投资金额
     */
    $scope.modInvestAmout = function(offset,$event){
      if($scope.assignment && $scope.assignment.status != 1){
        return;
      }
      $event.stopPropagation();
      $scope.assignmentInvestAmount = $scope.assignmentInvestAmount ? $scope.assignmentInvestAmount + offset : offset;
      $scope.assignmentInvestAmount = $scope.assignmentInvestAmount < 100 ? 100 : $scope.assignmentInvestAmount;
    }    

    /**
     * 跳转到投资记录页
     */
    $scope.toOrderList = function(){
      if(!$rootScope.isLogged){
        return;
      }else{
        $state.go('root.assignmentOrders', {
          number: $stateParams.number
       });
      }
    }
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;
    $scope.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;
    $scope.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) ;
    console.log($scope.deviceIsAndroid);
    console.log($scope.deviceIsIOS);
    console.log(deviceIsWindowsPhone);
  });
