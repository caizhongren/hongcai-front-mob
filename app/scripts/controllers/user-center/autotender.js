'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SecuritySettingsCtrl
 * @description
 * # SecuritySettingsCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('AutoTenderCtrl', function ($rootScope, $scope, $state, $timeout, Restangular, DateUtils) {
  $scope.showStatus = false;
  $scope.showDateLimit = false;
  $scope.showAnnual = false;
  $scope.showType = false;
  $scope.toggle = {};
  $scope.toggle.dateList = ['30','60','90','120','180','360','不限'];
  $scope.toggle.annualList = ['7','8','9','10','11','12','不限'];
  $scope.toggle.typeList = ['宏金保','债权转让','全部'];
  $scope.amountErrMsg = $scope.amountErrMsg? $scope.amountErrMsg : null;
  $scope.remainErrMsg = $scope.remainErrMsg? $scope.remainErrMsg : null;
  $scope.selectDate = function(date) {
    $scope.selectedDate = date;
  }

  $scope.selectAnnual = function(annual) {
    $scope.selectedAnnual = annual;
  }

  $scope.selectType = function(type) {
    $scope.selectedType = type;
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
 
 //判断选择标的类型
 var selectInvestType = function(type){
   if(type === '宏金保') {
     return 1;
   }
   if(type === "债权转让") {
     return 2;
   }
   if(type === '全部') {
     return 0;
   }
 };
 var typeToNum =function(num){
  if(num === 1) {
    return '宏金保';
  }
  if(num === 2) {
    return "债权转让";
  }
  if(num === 0) {
    return '全部';
  }
 };

 //得到用户选择时间'yyyy-mm-dd'的毫秒值
  var getMs = function(time) {
    var dt;
    if(typeof(time) === 'string'){
      dt = new Date(time.replace(/-/g, '/')).getTime();
      return dt;
    } else {
      dt = time.getTime();
      return dt;
    }

    
  };
 /*
 *自动投标详情
 */
 $scope.autoTendersDetail = function() {
   Restangular.one('/users/' + $rootScope.securityStatus.userId + '/autoTender' ).get({
     userId: $rootScope.securityStatus.userId
   }).then(function(response){
      // response


    $scope.autoTenders = response;
    $scope.autoTenders.maxRemainDay = !$scope.autoTenders.maxRemainDay ? 360 : $scope.autoTenders.maxRemainDay;
    $scope.autoTenders.maxRemainDay = $scope.autoTenders.maxRemainDay && $scope.autoTenders.maxRemainDay == 1825 ? '不限' : $scope.autoTenders.maxRemainDay;
    $scope.autoTenders.annualEarnings = !$scope.autoTenders.annualEarnings ? 7 : $scope.autoTenders.annualEarnings;
    $scope.autoTenders.annualEarnings = $scope.autoTenders.annualEarnings == 0 ? '不限' : $scope.autoTenders.annualEarnings;
    $scope.autoTenders.investnum = !$scope.autoTenders.investType ? 0 : $scope.autoTenders.investType;
    //没有选择类型，期限，利率，默认是后端传来的值，后端传来null,就是设置的默认值
    $scope.selectedType = $scope.selectedType ? $scope.selectedType : typeToNum($scope.autoTenders.investType);
    $scope.selectedDate = $scope.selectedDate ? $scope.selectedDate : $scope.autoTenders.maxRemainDay;
    $scope.selectedAnnual = $scope.selectedAnnual? $scope.selectedAnnual : $scope.autoTenders.annualEarnings;
    
    $scope.autoTenders.minInvestAmount = !$scope.autoTenders.minInvestAmount  ? 100 : $scope.autoTenders.minInvestAmount ;
    $scope.autoTenders.remainAmount = !$scope.autoTenders.remainAmount  ? 0 : $scope.autoTenders.remainAmount ;
    $scope.autoTenders.startTime = !$scope.autoTenders.startTime ? new Date().getTime() : $scope.autoTenders.startTime;
    $scope.autoTenders.endTime = !$scope.autoTenders.endTime ? new Date().getTime() + 365 * 24 * 3600 * 1000 : $scope.autoTenders.endTime;

    $scope.autoTenders.startDate = DateUtils.longTimeToDate($scope.autoTenders.startTime);
    $scope.autoTenders.endDate = DateUtils.longTimeToDate($scope.autoTenders.endTime);
   })
 };
 $scope.autoTendersDetail();




//跳转到个人设置页
var toSetting = function() {
  $state.go('root.userCenter.setting');
}

/*
*开启、编辑自动投标
*/
$scope.onAutoTenders = function(autoTender) {

  
  var startTime = getMs(autoTender.startDate) ;
  var endTime = getMs(autoTender.endDate);
  var Type = selectInvestType($scope.selectedType);
  var annual = $scope.selectedAnnual == "不限"? 0 : $scope.selectedAnnual;
  var days = $scope.selectedDate == "不限"? 1825 : $scope.selectedDate;
  checkMinAmount(autoTender.minInvestAmount);
  checkRemainAmount(autoTender.remainAmount);
  if($scope.amountErrMsg || $scope.remainErrMsg || autoTender.minInvestAmount === 0) {
    return;
  }
  if($scope.amountErrMsg || $scope.remainErrMsg) {
    return;
  }
  Restangular.one('/autoTenders').post('',{
    userId: $rootScope.securityStatus.userId,
    minInvestAmount: autoTender.minInvestAmount,
    minRemainDay: 0,
    maxRemainDay: days,
    annualEarnings: annual,
    investType: Type,
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
  Restangular.one('/users/' + $rootScope.securityStatus.userId + '/disabledAutoTender').put({
    userId: $rootScope.securityStatus.userId,
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



});