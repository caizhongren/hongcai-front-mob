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
    $scope.getIt = function(){
      $scope.showLimit = false;
      $rootScope.showFooter = true;
      $('.recharge').removeClass('position-fix'); 
      // 滚回到老地方！
      to(scrollTop);
    }
    
    $scope.showbankLimit = function() {
      // 在弹出层显示之前，记录当前的滚动位置
      scrollTop = getScrollTop();

      // 使body脱离文档流
      $('.recharge').addClass('position-fix'); 
      // 把脱离文档流的body拉上去！否则页面会回到顶部！
      document.body.style.top = -scrollTop + 'px';
      $scope.showLimit = true;
      $rootScope.showFooter = false;
    }
    function to(scrollTop){
      document.body.scrollTop = document.documentElement.scrollTop = scrollTop;
    }
    function getScrollTop(){
      return document.body.scrollTop || document.documentElement.scrollTop;
    }
   
    $scope.bankCardList_FU = [
      {'src': '/images/user-center/ICBK.png', 'cardName': '工商银行', 'limit': '5w/5w/20w'},
      {'src': '/images/user-center/BKCH.png', 'cardName': '中国银行', 'limit': '5w/10w/20w'},
      {'src': '/images/user-center/PCBC.png', 'cardName': '建设银行', 'limit': '5w/10w/20w'},
      {'src': '/images/user-center/ABOC.png', 'cardName': '农业银行', 'limit': '5w/10w/20w'},
      {'src': '/images/user-center/COMM.png', 'cardName': '交通银行', 'limit': '5w/10w/20w'},
      {'src': '/images/user-center/CMBC.png', 'cardName': '招商银行', 'limit': '5w/5w/20w'},
      {'src': '/images/user-center/CIBK.png', 'cardName': '中信银行', 'limit': '1w/1w/2w'},
      {'src': '/images/user-center/SZDB.png', 'cardName': '平安银行', 'limit': '5w/20w/20w'},
      {'src': '/images/user-center/MSBC.png', 'cardName': '民生银行', 'limit': '5w/20w/20w'},
      {'src': '/images/user-center/EVER.png', 'cardName': '光大银行', 'limit': '5w/20w/20w'},
      {'src': '/images/user-center/HXBK.png', 'cardName': '华夏银行', 'limit': '5w/20w/20w'},
      {'src': '/images/user-center/GDBK.png', 'cardName': '广发银行', 'limit': '5w/20w/20w'},
      {'src': '/images/user-center/PSBC.png', 'cardName': '邮政银行', 'limit': '5w/20w/20w'},
      {'src': '/images/user-center/FJIB.png', 'cardName': '兴业银行', 'limit': '5w/5w/20w'},
      {'src': '/images/user-center/SPDB.png', 'cardName': '浦发银行', 'limit': '5w/5w/20w'},
    ]
    $scope.bankCardList_UCF = [
      {'src': '/images/user-center/ICBK.png', 'cardName': '工商银行', 'limit': '5w/5w/不限'},
      {'src': '/images/user-center/BKCH.png', 'cardName': '中国银行', 'limit': '5w/50w/不限'},
      {'src': '/images/user-center/PCBC.png', 'cardName': '建设银行', 'limit': '20w/50w/不限'},
      {'src': '/images/user-center/ABOC.png', 'cardName': '农业银行', 'limit': '20w/50w/不限'},
      {'src': '/images/user-center/COMM.png', 'cardName': '交通银行', 'limit': '9999/9999/不限'},
      {'src': '/images/user-center/CMBC.png', 'cardName': '招商银行', 'limit': '5000/10w/不限'},
      {'src': '/images/user-center/CIBK.png', 'cardName': '中信银行', 'limit': '1w/1w/2w'},
      {'src': '/images/user-center/SZDB.png', 'cardName': '平安银行', 'limit': '50w/500w/不限'},
      {'src': '/images/user-center/MSBC.png', 'cardName': '民生银行', 'limit': '2000w/10000w/不限'},
      {'src': '/images/user-center/EVER.png', 'cardName': '光大银行', 'limit': '50w/不限/不限'},
      {'src': '/images/user-center/BOB.png', 'cardName': '北京银行', 'limit': '5000/5000/不限'},
      {'src': '/images/user-center/HXBK.png', 'cardName': '华夏银行', 'limit': '50w/150w/不限'},
      {'src': '/images/user-center/GDBK.png', 'cardName': '广发银行', 'limit': '不限/不限/不限'},
      {'src': '/images/user-center/PSBC.png', 'cardName': '邮政银行', 'limit': '10w/100w/不限'},
      {'src': '/images/user-center/FJIB.png', 'cardName': '兴业银行', 'limit': '5w/5w/不限'},
      {'src': '/images/user-center/SPDB.png', 'cardName': '浦发银行', 'limit': '5w/30w/不限'}
    ]

    //更换银行卡
    $scope.showChange = false;
    $scope.Iknow = function(){
      $scope.showChange = false;
      $rootScope.showFooter = true;
      $('.recharge').removeClass('position-fix'); 
      to(scrollTop);
    }
    $scope.changeCard = function() {
      scrollTop = getScrollTop();
      $('.recharge').addClass('position-fix'); 
      document.body.style.top = -scrollTop + 'px';
      $scope.showChange = true;
      $rootScope.showFooter = false;
    }
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
    // $rootScope.$on('$locationChangeSuccess',function(){//返回前页时，刷新前页
    //   parent.location.reload(); 
    // });
    // 获取用户的银行卡剩余额度
    $scope.getUserBankCard = function(expectPayCompany){
      var siteBankLimit = restmod.model(WEB_DEFAULT_DOMAIN + "/bank/getUserRechargeRemainLimit?&payCompany=" + expectPayCompany);
      siteBankLimit.$create({}).$then(function(response) {
        if (response.ret !== -1) {
          $scope.bankRemain = response.data.bankRemain;
        }
      });
    }
    
    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
        return;
      }
    });

    $scope.busy = false;
    $scope.recharge = function(amount) {
      if (amount < 3) {
        return;
      }
      if (amount > $scope.bankRemain) {
        return;
      }
      if($scope.busy){
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
      
    }
    $scope.selectPay(3);


  });
