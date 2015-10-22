'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:OrderCtrl
 * @description
 * # OrderCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('OrderCtrl', ['$scope', '$rootScope', 'HongcaiUser', function($scope, $rootScope, HongcaiUser) {


    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/orders').$then(function(response) {
        if (response.$status === 'ok') {
          // 获取用户的订单列表
          $scope.simpleOrders = response;
        } else {
          // 获取信息失败。
        }
      });

    });

  }]);
