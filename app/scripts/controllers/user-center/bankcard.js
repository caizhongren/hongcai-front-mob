'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BankcardCtrl
 * @description
 * # BankcardCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('BankcardCtrl', ['$scope', '$rootScope', '$state', 'HongcaiUser', 'restmod', 'WEB_DEFAULT_DOMAIN', function($scope, $rootScope, $state, HongcaiUser, restmod, WEB_DEFAULT_DOMAIN) {

    $rootScope.checkSession.promise.then(function() {
      if (!$rootScope.isLogged) {
        $state.go('root.login');
      }

      HongcaiUser.$find('0' + '/bankcard').$then(function(response) {
        if (response.ret === 1) {
          // 获取用户的银行卡信息
          $scope.simpleBankcard = response;
        } else {
          // 获取信息失败。
        }

        var unBindBankcardModel = restmod.model(WEB_DEFAULT_DOMAIN + '/yeepay');
        $scope.unBindBankcard = function() {
          unBindBankcardModel.$find('/unbindBankCard').$then(function(response) {
            $scope.showMask = false;
            $scope.showBankCard = false;
            if (!response || response.ret == -1) {
              return;
            }
            if ($rootScope.payCompany === 'cgt') {
              $state.go('root.yeepay-callback', {
                business: 'UNBIND_BANK_CARD'
              });
            }
            if ($rootScope.payCompany === 'yeepay') {
              $state.go('root.yeepay-callback', {
                business: 'UNBIND_BANK_CARD_ING'
              });
            }
          });
        }
      });
    });
    $scope.showMask = false;
    $scope.showBankCard = false;
    $scope.toRemoveCard = function() {
      $scope.showBankCard = true;
      $scope.showMask = true;
    }
    $scope.cancle = function() {
        $scope.showBankCard = false;
        $scope.showMask = false;
      }
      /*根据屏幕高度设置内容高度*/
    angular.element('document').ready(function() {
      //初始化宽度、高度
      angular.element(".bankcard-body").css("min-height", angular.element(window).height() + "px");
      //当文档窗口发生改变时 触发
      angular.element(window).resize(function() {
        angular.element(".bankcard-body").css("min-height", angular.element(window).height() + "px");
      });
    });
  }]);
