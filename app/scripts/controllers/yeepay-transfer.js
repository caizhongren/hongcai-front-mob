'use strict';
angular.module('p2pSiteMobApp')
  .controller('YeepayTransferCtrl', ['$scope', '$state', '$rootScope', '$stateParams', 'restmod', 'DEFAULT_DOMAIN', 'config', function ($scope, $state, $rootScope, $stateParams, restmod, DEFAULT_DOMAIN, config) {
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

    $scope.type = $stateParams.type;
    $scope.number = $stateParams.number;
    $scope.HongcaiUser = DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.id;

    if ($scope.type === 'recharge') {
      //充值
      var rechargeModel = restmod.model($scope.HongcaiUser + '/recharge');
      rechargeModel.$create({'amount':$scope.number}).$then(function(response) {
        if (response.$status === 'ok') {
          var req = response.req;
          var sign = response.sign;
          var _f = newForm();
          createElements(_f, 'req', req);
          createElements(_f, 'sign', sign);
          _f.action = config.YEEPAY_ADDRESS + 'toRecharge';
          _f.submit();
        } else {
            alert('充值失败',response);
        }
      });
    } else if ($scope.type === 'withdraw') {
      //提现
      var withdrawModel = restmod.model($scope.HongcaiUser + '/withdraw');
      withdrawModel.$create({'amount':$scope.number}).$then(function(response) {
        if (response.$status === 'ok') {
          var req = response.req;
          var sign = response.sign;
          var _f = newForm();
          createElements(_f, 'req', req);
          createElements(_f, 'sign', sign);
          _f.action = config.YEEPAY_ADDRESS + 'toWithdraw';
          _f.submit();
        } else {
            alert('充值失败',response);
        }
      });
    }

  }]);
