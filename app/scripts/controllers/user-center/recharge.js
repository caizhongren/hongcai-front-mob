'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RechargeCtrl
 * @description
 * # RechargeCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RechargeCtrl', function($scope, $rootScope, $stateParams, HongcaiUser, $state, restmod, DEFAULT_DOMAIN, WEB_DEFAULT_DOMAIN, Restangular) {
    $rootScope.selectedSide = 'account';
    $scope.rechargeAmount = $stateParams.amount;
    $scope.showLimit = false;
    $scope.getIt = function(){
      $scope.showLimit = false;
      $rootScope.showFooter = true;
    }
    $scope.showbankLimit = function() {
      $scope.showLimit = true;
      $rootScope.showFooter = false;
    }
    $scope.bankCardList = [
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
    //更换银行卡
    $scope.showChange = false;
    $scope.Iknow = function(){
      $scope.showChange = false;
      $rootScope.showFooter = true;
    }
    $scope.changeCard = function() {
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
        $state.go('root.yeepay-transfer', {
          type: 'BIND_BANK_CARD'
        });
      });
    }
    // $rootScope.$on('$locationChangeSuccess',function(){//返回前页时，刷新前页
    //   parent.location.reload(); 
    // });
    // 获取用户的银行卡剩余额度
    var siteBankLimit = restmod.model(WEB_DEFAULT_DOMAIN + "/bank/getUserRechargeRemainLimit?&payCompany=FUIOU");
    siteBankLimit.$create({}).$then(function(response) {
      if (response.ret !== -1) {
        $scope.bankRemain = response.data.bankRemain;
      }
    });

    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
        return;
      }
    });

    $scope.recharge = function(amount) {
      $state.go('root.yeepay-transfer', {
        type: 'recharge',
        number: amount
      });
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

      $state.go('root.yeepay-transfer', {
        type: 'BIND_BANK_CARD'
      });
    };


  });
