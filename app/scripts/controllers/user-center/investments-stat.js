'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:InvestmentsStatCtrl
 * @description
 * # InvestmentsStatCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
/*  .controller('InvestmentsStatCtrl', ['$state', '$rootScope', 'HongcaiUser',function ($scope, $rootScope, HongcaiUser) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.user.id + '/account').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户投资信息
          $scope.userAccount = response;

        } else {
          // 获取信息失败。
        }
      });
    }
    $rootScope.selectedSide =  'investments-stat';
  }]);*/
  .controller('InvestmentsStatCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'DEFAULT_DOMAIN', 'config', function ($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN, config) {
    if ($rootScope.hasLoggedUser) {
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/investments/stat').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户金额信息
          $scope.investmentsStat = response;
        } else {
          // 获取信息失败。
        }
      });
    }

    $rootScope.selectedSide =  'investments-stat';

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

    $scope.toInvest = function(notPayOrder) {
      restmod.model(DEFAULT_DOMAIN + '/orders/' + notPayOrder.number + '/users/' + $rootScope.hasLoggedUser.id + '/payment').$create().$then(function(response) {
        if (response.$status === 'ok') {
          var req = response.req;
          var sign = response.sign;
          var _f = newForm(); //创建一个form表单
          createElements(_f, 'req', req); //创建form中的input对象
          createElements(_f, 'sign', sign);
          _f.action = config.YEEPAY_ADDRESS + 'toTransfer'; //form提交地址
          _f.submit(); //提交
        }
        // $state.go('');
      })
    }



    // 退出登录功能
    $scope.toLogout = function() {
      // var
      if ($rootScope.hasLoggedUser) {
        // TODO  登出的model在这里不太好吧。
        var logoutModel = restmod.model(DEFAULT_DOMAIN + '/users/' + $rootScope.hasLoggedUser.id + '/logout');
        logoutModel.$create().$then(function(response) {
          if (response.ret === 1) {
            $rootScope.hasLoggedUser = null;
            $rootScope.isLogged = false;
            $state.go('root.main');
          }
        });
      }
    };

  }]);
