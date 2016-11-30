'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SecuritySettingsCtrl
 * @description
 * # SecuritySettingsCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('AutoTenderCtrl',['$rootScope', '$scope', '$state', '$timeout', 'Restangular', 'DateUtils', function ($rootScope, $scope, $state, $timeout, Restangular, DateUtils) {



  $scope.testDate = new Date();


  $scope.showStatus = false;
  $scope.showDateLimit = false;
  $scope.showAnnual = false;
  $scope.showType = false;
  $scope.toggle = {};
  $scope.toggle.annualList = {
    "7": '7%',
    '8': '8%',
    '9': '9%',
    '10': '10%',
    '11': '11%',
    '12': '12%',
    "0": '不限'
  };
  $scope.toggle.dateList = {
    '30': '30天',
    '60': '60天',
    '90': '90天',
    '120': '120天',
    '180': '180天',
    '360': '360天',
    '1825': '不限'
  };
  $scope.toggle.typeList = {
    '1':'宏金保',
    '2':'债权转让',
    '0':'全部'
  };
  $scope.amountErrMsg = $scope.amountErrMsg? $scope.amountErrMsg : null;
  $scope.remainErrMsg = $scope.remainErrMsg? $scope.remainErrMsg : null;
  $scope.selectDate = function(date) {
    $scope.autoTenders.maxRemainDay = date;
  }

  $scope.selectAnnual = function(annual) {
    $scope.autoTenders.annualEarnings = annual;
  }

  $scope.selectType = function(type) {
    $scope.autoTenders.investType = type;
  }


  var pattern1 = /^\+?[1-9][0-9]*$/;
  var pattern2 = /^[0-9]*(\.[0-9]{1,2})?$/;
  var checkMinAmount = function(val) {
    if(val == undefined || val == undefined) {
      $scope.amountErrMsg = '请输入最小投标金额';
    }else if(val > 1000000){
      $scope.amountErrMsg = '最小投标金额必须小于1000000';
    }else if(val < 100 || val % 100 !==0 || !(pattern1.test(val))){
      $scope.amountErrMsg = '请输入100的正整数倍';
    }
  };
  var checkRemainAmount = function(val) {
    if(val == undefined || val == undefined) {
      $scope.remainErrMsg = '请输入账户保留金额';
    }else if(val > 1000000){
      $scope.remainErrMsg = '账户保留金额必须小于1000000';
    }else if(val < 0 || !(pattern2.test(val))){
      $scope.remainErrMsg = '最多保留两位小数';
    }
  }
  //校验最小投标金额
  $scope.$watch('autoTenders.minInvestAmount', function(newVal, oldVal) {
    $scope.amountErrMsg = null;
    if(newVal !== oldVal){
      $scope.amountErrMsg = null;
    }
    if(newVal){
      checkMinAmount(newVal);
    }
  });
  //校验账户保留金额
 $scope.$watch('autoTenders.remainAmount', function(newVal, oldVal) {
  $scope.remainErrMsg = null;
   if(newVal !== oldVal){
     $scope.remainErrMsg = null;
   }
   if(newVal){
     checkRemainAmount(newVal);
   }
 });
 


 /*
 *自动投标详情
 */
 $scope.autoTendersDetail = function() {
   Restangular.one('/users/0/autoTender' ).get().then(function(response){
      // response


    $scope.autoTenders = response;
    $scope.autoTenders.maxRemainDay = $scope.autoTenders.maxRemainDay  == null ? 360 : $scope.autoTenders.maxRemainDay;
    $scope.autoTenders.annualEarnings = $scope.autoTenders.annualEarnings == null ? 7 : $scope.autoTenders.annualEarnings;
    $scope.autoTenders.investType = $scope.autoTenders.investType == null ? 0 : $scope.autoTenders.investType;
    
    $scope.autoTenders.minInvestAmount = $scope.autoTenders.minInvestAmount ==null  ? 100 : $scope.autoTenders.minInvestAmount ;
    $scope.autoTenders.remainAmount = $scope.autoTenders.remainAmount == null  ? 0 : $scope.autoTenders.remainAmount ;
    $scope.autoTenders.startTime = $scope.autoTenders.startTime == null ? new Date().getTime() : $scope.autoTenders.startTime;
    $scope.autoTenders.endTime = $scope.autoTenders.endTime == null ? new Date().getTime() + 365 * 24 * 3600 * 1000 : $scope.autoTenders.endTime;

    $scope.autoTenders.startDate = new Date($scope.autoTenders.startTime);
    $scope.autoTenders.endDate = new Date($scope.autoTenders.endTime);
   })
 };
 $scope.autoTendersDetail();


$scope.toEdit = function(){
  $scope.showStatus = true;
}


//跳转到个人设置页
var toSetting = function() {
  $state.go('root.userCenter.setting');
}

/*
*开启、编辑自动投标
*/
$scope.onAutoTenders = function(autoTender) {

  
  var startTime = autoTender.startDate.getTime();
  var endTime = autoTender.endDate.getTime();
  checkMinAmount(autoTender.minInvestAmount);
  checkRemainAmount(autoTender.remainAmount);
  if($scope.amountErrMsg || $scope.remainErrMsg || autoTender.minInvestAmount === 0) {
    return;
  }
  if($scope.amountErrMsg || $scope.remainErrMsg) {
    return;
  }
  Restangular.one('/autoTenders').post('',{
    userId: $rootScope.account.userId,
    minInvestAmount: autoTender.minInvestAmount,
    minRemainDay: 0,
    maxRemainDay: autoTender.maxRemainDay,
    annualEarnings: autoTender.annualEarnings,
    investType: autoTender.investType,
    remainAmount: autoTender.remainAmount,
    startTime: startTime,
    endTime: endTime
  }).then(function(response){
    if(response && response.ret !== -1) {
      $rootScope.successMsg = '已开启！';
      $rootScope.showSuccessToast = true;
      $timeout(function() {
        $rootScope.showSuccessToast = false;
        $rootScope.successMsg = '';
        toSetting();
      }, 1000);
    }
  })
};

/*
*关闭自动投标
*/
$scope.offAutoTenders = function() {
  Restangular.one('/users/0/disabledAutoTender').put({
    status: 3
  }).then(function(response){
    if(response && response.ret !== -1){
      $rootScope.successMsg = '已禁用！';
      $rootScope.showSuccessToast = true;
      $timeout(function() {
        $rootScope.showSuccessToast = false;
        $rootScope.successMsg = '';
        toSetting();
      }, 1000);
    }
  })

};



}]);