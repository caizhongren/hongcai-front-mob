'use strict';
angular.module('p2pSiteMobApp')
  .controller('YeepayTransferCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'restmod', 'DEFAULT_DOMAIN', 'config', function($scope, $state, $rootScope, $stateParams, restmod, DEFAULT_DOMAIN, config) {
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
    // 新打开的页面无法获取$rootScope.hasLoggedUser
    // if ($rootScope.hasLoggedUser === undefined) {
    //   window.location.reload();
    // }
    // var checkModel = restmod.model(DEFAULT_DOMAIN + '/users');
    // checkModel.$find('checkSession').$then(function(response) {
    //   if (response.user) {
    //     $rootScope.hasLoggedUser = response.user;
    //
    //   }
    // });
    $scope.type = $stateParams.type;
    $scope.number = $stateParams.number;
    $scope.HongcaiUser = DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.id;
    // 跳转较慢并且认证用户失败的判断。
    if ($scope.type === 'recharge') {
      //充值
      var rechargeModel = restmod.model($scope.HongcaiUser + '/recharge');
      rechargeModel.$create({
        'amount': $scope.number,
        'from': 2
      }).$then(function(response) {
        if (response.$status === 'ok') {
          var req = response.req;
          var sign = response.sign;
          var _f = newForm();
          createElements(_f, 'req', req);
          createElements(_f, 'sign', sign);
          _f.action = config.YEEPAY_ADDRESS + 'toRecharge';
          _f.submit();
        } else {
          alert('充值失败', response);
        }
      });
    } else if ($scope.type === 'withdraw') {
      //提现
      var withdrawModel = restmod.model($scope.HongcaiUser + '/withdraw');
      withdrawModel.$create({
        'amount': $scope.number,
        'from': 2
      }).$then(function(response) {
        if (response.$status === 'ok') {
          var req = response.req;
          var sign = response.sign;
          var _f = newForm();
          createElements(_f, 'req', req);
          createElements(_f, 'sign', sign);
          _f.action = config.YEEPAY_ADDRESS + 'toWithdraw';
          _f.submit();
        } else {
          alert('充值失败', response);
        }
      });
    } else if ($scope.type === 'register') {
      //提现
      var withdrawModel = restmod.model($scope.HongcaiUser + '/yeepayRegister');
      withdrawModel.$create({
        'amount': $scope.number,
        'from': 2
      }).$then(function(response) {
        if (response.$status === 'ok') {
          var req = response.req;
          var sign = response.sign;
          var _f = newForm();
          createElements(_f, 'req', req);
          createElements(_f, 'sign', sign);
          _f.action = config.YEEPAY_ADDRESS + 'toRegister';
          _f.submit();
        } else {
          alert('开通易宝失败', response);
        }
      });
    }
  }]);
