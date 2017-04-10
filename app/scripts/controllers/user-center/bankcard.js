'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BankcardCtrl
 * @description
 * # BankcardCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('BankcardCtrl', function($scope, $rootScope, $state, restmod, WEB_DEFAULT_DOMAIN, Restangular) {
    // 获取用户总资产
    var userAccount = {
      tTotalAssets: 0
    };
    $scope.userAccount = sessionStorage.getItem('userAccount') ? angular.fromJson(sessionStorage.getItem('userAccount')) : userAccount;
    Restangular.one('users').one('0/account').get().then(function(response){
      if(!response || response.ret == -1) { return;}
      $scope.userAccount = response;
      sessionStorage.setItem('userAccount', angular.toJson($scope.userAccount));
    });

    $scope.voucher = Restangular.one('users/0').one('bankcard').get().then(function(response) {
      if (response.$status === "ok" && response.ret !== -1) {
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
  });
