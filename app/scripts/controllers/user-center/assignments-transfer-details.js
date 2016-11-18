'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:AssignmentsTransferCtrl
 * @description
 * # AssignmentsTransferCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('AssignmentsTransferCtrl', function(config, Restangular, $scope, $rootScope, $state, $stateParams, $timeout, DateUtils) {
    var num = $stateParams.number;
    /*
    *获取债券认购规则
    */
    Restangular.one('assignments/assignmentRule').get().then(function(response){
      $scope.discountFeeRate = response.discountFeeRate;
      $scope.borderDay = response.borderDay;
      $scope.minFee = response.minFee;
      $scope.lessThanOrEqualBorderDayFee = response.lessThanOrEqualBorderDayFee;
      $scope.greaterThanBorderDayFee = response.greaterThanBorderDayFee;
      $scope.recycleReward = response.recycleReward;
      $scope.maxReceivedPaymentsRate = response.maxReceivedPaymentsRate;
    });
    /*
    *获取债券详情
    */
    Restangular.one('creditRights/'+ num + '/creditDetail').get().then(function(response){
      if(response && response.ret !==-1) {
        $scope.creditRight = response.creditRight;
        //现金券判断
        $scope.cashCoupon = $scope.recycleReward && response.increaseRateCoupon && response.increaseRateCoupon.type ===2 ? response.increaseRateCoupon.value : 0;
        //原有债权金额
        $scope.creditRightAmount = response.creditRight.transferableAmount;
        $scope.assignmentsNumber = response.creditRight.number;
        //步进值
        $scope.increaseAmount = response.project.increaseAmount;
        //原标利率
        $scope.creditBaseRate = response.creditRight.baseRate;
        $scope.transferPercent = $scope.creditBaseRate;
        //creatTime(ms)
        $scope.creatTime = response.creditRight.createTime;
        //当前时间
        $scope.currentDate = new Date().getTime();
        //上一次回款时间
        var lastRepaymentTime = response.projectBill.lastRepaymentTime;

        //剩余期限
        $scope.remainDay = DateUtils.intervalDay(response.project.repaymentDate, $scope.currentDate);

        //利率最大值
        $scope.profitMax = 36500 * (1 - $scope.maxReceivedPaymentsRate) / $scope.remainDay + $scope.creditBaseRate;

        //应收利息天数
        $scope.profitDate = DateUtils.intervalDay($scope.currentDate, lastRepaymentTime) * ($scope.currentDate > lastRepaymentTime ? 1 : -1);
      }
    });

    var checkAmount = function(amount) {
      if(amount == 0 ){
        $scope.msg = '请输入大于0的数字';
      }else if(amount < $scope.increaseAmount ){
        $scope.msg = '转让金额必须大于等于' + $scope.increaseAmount;
      }else if(amount % $scope.increaseAmount !==0 ){
        $scope.msg = '转让金额必须为'+ $scope.increaseAmount +'的整数倍';
      }else if(amount > $scope.creditRightAmount){
        $scope.msg = '转让金额必须小于债权金额';
      }
    }
    var checkAnuual = function(annual) {
      if(annual < $scope.creditBaseRate ){
        $scope.errMsg = '最小转让利率为' + $scope.creditBaseRate + '%';
      }else if(annual > $scope.profitMax ){
        $scope.errMsg = '最大转让利率为'+ $scope.profitMax.toFixed(2) +'%';
      }
    }

    //监测转让金额
    $scope.$watch('transferAmount', function(newVal, oldVal){
      if(newVal !== oldVal){
        $scope.msg = undefined;
      }
      if(newVal){
        checkAmount(newVal);
      }
      //手续费计算   
      if ($scope.currentDate - $scope.creatTime <= $scope.borderDay*24*60*60*1000) {
        $scope.counterFee = $scope.transferAmount * $scope.lessThanOrEqualBorderDayFee / 100 * $scope.discountFeeRate > $scope.minFee ? $scope.transferAmount * $scope.lessThanOrEqualBorderDayFee / 100 * $scope.discountFeeRate : $scope.minFee;
      }else {
        $scope.counterFee = $scope.transferAmount * $scope.greaterThanBorderDayFee /100 * $scope.discountFeeRate > $scope.minFee ? $scope.transferAmount * $scope.greaterThanBorderDayFee /100 * $scope.discountFeeRate : $scope.minFee;
      }
      //待收未收利息
      $scope.profit = $scope.creditBaseRate * newVal * $scope.profitDate /36500;

    });

    //监测转让利率
    $scope.$watch('transferPercent', function(newVal, oldVal){
      if(newVal !== oldVal){
        $scope.errMsg = undefined;
      }
      if(newVal){
        checkAnuual(newVal);
      }
    });
    /*
    * 确认转让
    */
    $scope.assignmentsTransfer = function(transferAmount, transferPercent) {
      if ($scope.msg || $scope.errMsg||transferAmount ==undefined || transferPercent == undefined || $scope.transferAmount <=0 ) {
        return;
      }
      if(transferAmount && transferPercent) {
        checkAmount(transferAmount);
        checkAnuual(transferPercent);
        if(transferAmount < $scope.increaseAmount || transferAmount % $scope.increaseAmount !==0  || transferAmount > $scope.creditRightAmount || transferPercent < $scope.creditBaseRate || transferPercent > $scope.profitMax) {
          return;
        }
      }
      $rootScope.showLoadingToast = true;
      Restangular.one('/creditRights/' + $scope.assignmentsNumber).post('assign',{
        creditRightId: $scope.creditRight.id,
        amount: transferAmount,
        annualEarnings: transferPercent
      }).then(function(response){
        if(response && response.ret !== -1){
          // $rootScope.showMsg('转让成功！');
          $rootScope.showLoadingToast = false;
          $state.go('root.userCenter.assignments');
        } else {
          $rootScope.showLoadingToast = false;
          $rootScope.showMsg(response.msg);
        }
      });
    }
  


  });
