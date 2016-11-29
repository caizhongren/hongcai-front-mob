'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:SecuritySettingsCtrl
 * @description
 * # SecuritySettingsCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')

.controller('SecuritySettingsCtrl', function ($rootScope, $scope, $state, $timeout, Restangular) {
  $scope.showStatus = false;
  $scope.showDateLimit = false;
  $scope.showAnnual = false;
  $scope.showType = false;
  $scope.toggle = {};
  $scope.toggle.dateList = ['30','60','90','120','180','360','不限'];
  $scope.toggle.annualList = ['7','8','9','10','11','12','不限'];
  $scope.toggle.typeList = ['宏金保','债权转让','全部'];
  $scope.selectedDate = $scope.selectedDate? $scope.selectedDate : '不限';
  $scope.selectedAnnual = $scope.selectedAnnual? $scope.selectedAnnual : 7;
  $scope.selectedType = $scope.selectedType? $scope.selectedType : '全部';
  $scope.amountErrMsg = $scope.amountErrMsg? $scope.amountErrMsg : null;
  $scope.remainErrMsg = $scope.remainErrMsg? $scope.remainErrMsg : null;
  $scope.selectDate = function(date) {
    $scope.selectedDate = null;
    $scope.selectedDate = date;
    // $scope.showAnnual = false;
    // $scope.showType = false;
  }
  $scope.selectAnnual = function(annual) {
    $scope.selectedAnnual = null;
    $scope.selectedAnnual = annual;
    // $scope.showDateLimit = false;
    // $scope.showType = false;
  }
  $scope.selectType = function(type) {
    $scope.selectedType = null;
    $scope.selectedType = type;
    console.log($scope.selectedType);
    console.log($scope.selectedDate);
    // $scope.showDateLimit = false;
    // $scope.showAnnual = false;
  }


  var pattern1 = /^\+?[1-9][0-9]*$/;
  var pattern2 = /^[0-9]*(\.[0-9]{1,2})?$/;
  var checkMinAmount = function(val) {
    if(val == undefined || !val) {
      $scope.amountErrMsg = '最小投标金额不能为空';
    }
    if(val > 1000000){
      $scope.amountErrMsg = '最小投标金额必须小于1000000';
    }else if(val < 100 || val % 100 !==0 || !(pattern1.test(val))){
      $scope.amountErrMsg = '请输入100的正整数倍';
    }
  };
  var checkRemainAmount = function(val) {
    if(val == undefined || !val) {
      $scope.remainErrMsg = '账户保留金额不能为空'
    }
    if(val > 1000000){
      $scope.remainErrMsg = '账户保留金额必须小于1000000';
    }else if(val <= 0 || !(pattern2.test(val))){
      $scope.remainErrMsg = '最多保留两位小数';
    }
  }
  //校验最小投标金额
  $scope.$watch('form.amount', function(newVal, oldVal) {
    $scope.amountErrMsg = null;
    if(newVal !== oldVal){
      $scope.amountErrMsg = null;
    }
    if(newVal){
      checkMinAmount(newVal);
    }
  });
  //校验账户保留金额
 $scope.$watch('form.remain', function(newVal, oldVal) {
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
   Restangular.one('/users/' + $rootScope.securityStatus.userId + '/autoTender' ).get({
     userId: $rootScope.securityStatus.userId
   }).then(function(response){
    $scope.autoTenders = response;
    $scope.autoTenders.maxRemainDay = $scope.autoTenders.maxRemainDay == 1825 ? '不限' : $scope.autoTenders.maxRemainDay;
    $scope.autoTenders.annualEarnings = $scope.autoTenders.annualEarnings == 0 ? '不限' : $scope.autoTenders.annualEarnings;
   })
 };
 $scope.autoTendersDetail();


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
//得到用户选择时间'yyyy-mm-dd'的毫秒值
 var getMs = function(time) {
   var dt = new Date(time.replace(/-/g, '/')).getTime();
   return dt;
 };

//跳转到个人设置页
var toSetting = function() {
  $state.go('root.userCenter.setting');
}

/*
*开启、编辑自动投标
*/
$scope.onAutoTenders = function(form) {
  var startDate = getMs(form.startDate);
  var endDate = getMs(form.endDate);
  var Type = selectInvestType($scope.selectedType);
  var annual = $scope.selectedAnnual == "不限"? 0 : $scope.selectedAnnual;
  var days = $scope.selectedDate == "不限"? 1825 : $scope.selectedDate;
  checkMinAmount(form.amount);
  checkRemainAmount(form.remain);
  if($scope.amountErrMsg !== null || $scope.remainErrMsg !== null) {
    return;
  }
  Restangular.one('/autoTenders').post('',{
    userId: $rootScope.securityStatus.userId,
    minInvestAmount: form.amount,
    minRemainDay: 0,
    maxRemainDay: days,
    annualEarnings: annual,
    investType: Type,
    remainAmount: form.remain,
    startTime: startDate,
    endTime: endDate
  }).then(function(response){
    if(response && response.ret !== -1) {
      $rootScope.successMsg = '开启成功！';
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
*关闭自动投标userId:用户ID,
          status:1:启用，2:过期，3:禁用
*/
$scope.offAutoTenders = function() {
  Restangular.one('/users/' + $rootScope.securityStatus.userId + '/disabledAutoTender').put({
    userId: $rootScope.securityStatus.userId,
    status: 3
  }).then(function(response){
    if(response && response.ret !== -1){
      $rootScope.successMsg = '禁用成功！';
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