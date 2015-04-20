'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterYeepayCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterYeepayCtrl', ['$rootScope','$scope', '$state', '$stateParams', 'md5', 'registerYeepay', 'mobileCaptcha', function ($rootScope, $scope, $state, $stateParams, md5, registerYeepay, mobileCaptcha) {
    
    // 注册易宝POST
    $scope.signUpYeepay = function(user) {
      registerYeepay.$create({userId: user.id,email: user.email,realName: user.realName,idCardNo: user.idCardNo}).$then(function(response){
        if (response.ret === -1) {
          $scope.msg = response.msg;
        } else {
          $state.go('root.register-success');
        }

      });
    };
    
  }]);
