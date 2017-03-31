'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RechargeCtrl
 * @description
 * # RechargeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RechargeCtrl', function($timeout, $scope, $rootScope, $stateParams, HongcaiUser, $state, restmod, DEFAULT_DOMAIN, WEB_DEFAULT_DOMAIN, toCunGuanUtils) {
    $rootScope.selectedSide = 'account';
    $scope.rechargeAmount = $stateParams.amount;
    $scope.showLimit = false;
    var scrollTop = 0;
    // 支持银行弹窗
    $scope.showbankLimit = function() {
      $scope.showLimit = !$scope.showLimit;
      $scope.showLimit ? unlockScreen() : lockScreen();
    }

    function lockScreen() {
      $rootScope.showFooter = true;
      $('.recharge').removeClass('position-fix'); 
      // 滚回到老地方！
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }
    function unlockScreen() {
      // 在弹出层显示之前，记录当前的滚动位置
      scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      // 使body脱离文档流
      $('.recharge').addClass('position-fix'); 
      // 把脱离文档流的body拉上去！否则页面会回到顶部！
      document.body.style.top = -scrollTop + 'px';
      $rootScope.showFooter = false;
    }
   

    //银行卡维护
    $scope.maintainCard = function() {
      $rootScope.showChange = !$rootScope.showChange;
      $rootScope.showChange ? unlockScreen() : lockScreen();
    }

    // 解绑银行卡
    var unBindBankcardModel = restmod.model(WEB_DEFAULT_DOMAIN + '/yeepay');
    $scope.unBindBankcard = function() {
      unBindBankcardModel.$find('/unbindBankCard').$then(function(response) {
        $scope.showChange = false;
        if (!response || response.ret == -1) {
          return;
        }
        toCunGuanUtils.to('BIND_BANK_CARD', null, null, null, null, null);
      });
    }

    // 获取用户的银行卡剩余额度
    $scope.getUserBankCard = function(expectPayCompany){
      var siteBankLimit = restmod.model(WEB_DEFAULT_DOMAIN + "/bank/getUserRechargeRemainLimit?&payCompany=" + expectPayCompany);
      siteBankLimit.$create({}).$then(function(response) {
        if (response.ret !== -1) {
          $scope.bankRemain = response.data.bankRemain;
          $scope.bankStatus = response.data.bankStatus; //0 正常 1维护
        }
      });
    }

    $scope.bankCardList = {};
    $scope.singleLimit = [];
    // 查询支付公司下所有银行限额信息
    $scope.getBankRechargeLimit = function(expectPayCompany){
      var siteBankRechargeLimit = restmod.model(WEB_DEFAULT_DOMAIN + "/bank/getBankRechargeLimit?&payCompany=" + expectPayCompany);
      siteBankRechargeLimit.$create({}).$then(function(response) {
        if (response.ret !== -1) {
          // if (expectPayCompany == 'UCFPAY') {
            $scope.bankCardList = response.data.bankLimit;
            $scope.changeCardList($scope.bankCardList);
          // }else if (expectPayCompany == 'FUIOU') {
            // $scope.bankCardList_FU = response.data.bankLimit;
            // $scope.bankCardList($scope.bankCardList_FU);
          // }
        }
      });
    }

    // 支付先锋、富友银行卡限额不限、（万）w单位判断
    $scope.changeCardList= function(expectPayCompanyList) {
      
      $scope.singleLimit = [];
      $scope.dayLimit = [];
      $scope.monthLimit = [];
      for(var i=0; i< expectPayCompanyList.length; i++){
        $scope.singleLimit.push(expectPayCompanyList[i].singleLimit <0 ? '不限' : expectPayCompanyList[i].singleLimit%10000 ==0 ? expectPayCompanyList[i].singleLimit/10000 +'w' : expectPayCompanyList[i].singleLimit);
        $scope.dayLimit.push(expectPayCompanyList[i].dayLimit <0 ? '不限' : expectPayCompanyList[i].dayLimit%10000 ==0 ? expectPayCompanyList[i].dayLimit/10000 +'w' : expectPayCompanyList[i].dayLimit);
        $scope.monthLimit.push(expectPayCompanyList[i].monthLimit <0 ? '不限' : expectPayCompanyList[i].monthLimit%10000 ==0 ? expectPayCompanyList[i].monthLimit/10000 +'w' : expectPayCompanyList[i].monthLimit);
      }
    }
    

    $scope.busy = false;
    $scope.recharge = function(amount) {
      if ($scope.bankStatus && $scope.bankStatus == 1) {  //银行卡维护
        $scope.maintainCard();
        return;
      }
      
      if (!amount || amount < 3 || amount > $scope.bankRemain || $scope.busy) {
        return;
      }
    
      $scope.busy = true;
      $timeout(function() {
        $scope.busy = false;
      }, 1000);

      toCunGuanUtils.to('recharge', amount, null, null, $scope.rechargeWay, $scope.expectPayCompany);
    }
    HongcaiUser.$find('0' + '/availableCash').$then(function(response) {
      if (response.ret !== -1) {
        // 获取用户充值信息
        $scope.simpleWithdraw = response;
      } else {
        // 获取信息失败。
      }
    });

    /**
     * 绑定银行卡
     */
    $scope.bindBankcard = function() {
      if ($scope.simpleWithdraw.cardStatus == 'VERIFIED' || $scope.simpleWithdraw.cardStatus == 'VERIFYING') {
        return;
      }
      toCunGuanUtils.to('BIND_BANK_CARD', null, null, null, null, null);
    };

    //记录选择支付方式 'FUIOU':富友，'ALLINPAY'：通联，'UMPAY':通联优势， 'UCFPAY': 先锋支付
    //payment 1: 富友，2: 通联优势，3: 先锋支付
    $scope.selectPay = function(payment) {
      $scope.bankCardList = {};
      $scope.payment = payment;
      // $scope.bankRemainHolder = $scope.payment == 1? '该卡可充值' + $scope.bankRemain + '元' : '';
      if(payment ===1){
        $scope.rechargeWay = 'SWIFT';
        $scope.expectPayCompany = 'FUIOU';
      }else if (payment === 3) {
        $scope.rechargeWay = 'SWIFT';
        $scope.expectPayCompany = 'UCFPAY';
      }
      $scope.getUserBankCard($scope.expectPayCompany);
      $scope.getBankRechargeLimit($scope.expectPayCompany);
      
    }
    $scope.selectPay(3);


  });
