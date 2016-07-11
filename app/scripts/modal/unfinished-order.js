/*
* @Author: wangyadan
* @Date:   2016-07-11 12:13:11
* @Last Modified by:   wangyadan
* @Last Modified time: 2016-07-11 17:31:31
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('UnfinishedOrderCtrl', function($scope, $state, $rootScope, $uibModalInstance,order,Restangular) {

    $scope.order = order;
    $scope.projectDays = Math.ceil((order.repaymentDate-order.createTime)/1000/3600/24);
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
    $scope.cancelUnpay = function(){
      console.log(123);
      Restangular.one('orders').one("/"+order.number).remove().then(function(response) {
        if(response.ret === -1){
            return;
          }
        $scope.cancel();
      });
    }
    $scope.goonPay = function(){
      $state.go('root.yeepay-transfer', {
             type: 'transfer',
             number: $scope.order.number
           });
      $scope.cancel();
    }

  });

