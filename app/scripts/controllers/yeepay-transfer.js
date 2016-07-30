'use strict';
angular.module('p2pSiteMobApp')
  .controller('YeepayTransferCtrl', function($scope, $state, $rootScope, $stateParams, restmod, DEFAULT_DOMAIN, config, Utils) {
    function newForm() {
      var f = document.createElement('form');
      document.body.appendChild(f);
      f.method = 'post';
      // f.target = '_blank';
      return f;
    }

    function createElements(eForm, eName, eValue) {
      var e = document.createElement('input');
      eForm.appendChild(e);
      e.type = 'text';
      e.name = eName;
      if (!document.all) {
        e.style.display = 'none';
      } else {
        e.style.display = 'block';
        e.style.width = '0px';
        e.style.height = '0px';
      }
      e.value = eValue;
      return e;
    }
    // 
    function redirectToYeepay(business, encrpyMsg) {
      if (encrpyMsg.ret !== -1) {
        var req = encrpyMsg.req;
        var sign = encrpyMsg.sign;
        var _f = newForm();
        createElements(_f, 'req', req);
        createElements(_f, 'sign', sign);
        _f.action = config.YEEPAY_ADDRESS + business;
        _f.submit();
      } else {
        alert(encrpyMsg.msg);
      }
    }

    $scope.type = $stateParams.type;
    $scope.number = $stateParams.number;
    $scope.realName = $stateParams.realName;
    $scope.idNo = $stateParams.idNo;

    $rootScope.checkSession.promise.then(function() {
      $scope.HongcaiUser = DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.id;
      // 跳转较慢并且认证用户失败的判断。
      if ($scope.type === 'recharge') {
        //充值
        var rechargeModel = restmod.model($scope.HongcaiUser + '/recharge');
        rechargeModel.$create({
          'amount': $scope.number,
          'from': 2,
          'device': Utils.deviceCode()
        }).$then(function(response) {

          redirectToYeepay('toRecharge', response);
        });

      } else if ($scope.type === 'withdraw') { //提现

        var withdrawModel = restmod.model($scope.HongcaiUser + '/withdraw');
        withdrawModel.$create({
          'amount': $scope.number,
          'from': 2,
          'device': Utils.deviceCode()
        }).$then(function(response) {
          redirectToYeepay('toWithdraw', response);
        });

      } else if ($scope.type === 'BIND_BANK_CARD') { //绑卡

        var bindBankcardModel = restmod.model($scope.HongcaiUser + '/bindBankcard');
        bindBankcardModel.$create({
          'from': 2,
          'device': Utils.deviceCode()
        }).$then(function(response) {
          redirectToYeepay('toBindBankCard', response);
        });

      } else if ($scope.type === 'register') { // 开通易宝
        var yeepayRegisterModel = restmod.model($scope.HongcaiUser + '/yeepayRegister');
        yeepayRegisterModel.$create({
          'realName': $scope.realName,
          'idCardNo': $scope.idNo,
          'from': 2,
          'device': Utils.deviceCode()
        }).$then(function(response) {
          redirectToYeepay('toRegister', response);
        });
      } else if ($scope.type === 'transfer') { //投资

        restmod.model(DEFAULT_DOMAIN + '/orders/' + $scope.number + '/users/' + $rootScope.hasLoggedUser.id + '/payment').$create().$then(function(response) {
          redirectToYeepay('toTransfer', response);
        });

      } else if ($scope.type === 'autoTransfer') { // 自动投标

        var autoTransfer = restmod.model($scope.HongcaiUser + '/authorizeAutoTransfer');
        autoTransfer.$create({
          'from': 2,
          'device': Utils.deviceCode()
        }).$then(function(response) {
          redirectToYeepay('toAuthorizeAutoTransfer', response);
        });

      } else if ($scope.type === 'RESET_MOBILE') { //修改手机号码（已绑定）      
        var resetMobile = restmod.model($scope.HongcaiUser + '/resetMobile');
        resetMobile.$create({
          'from': 2,
          'mobile': $stateParams.number
        }).$then(function(response){
          redirectToYeepay('toResetMobile',response);
        });
      }

    });


  });
