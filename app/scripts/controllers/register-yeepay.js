'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterYeepayCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterYeepayCtrl', ['$rootScope','$scope', '$state', '$stateParams', 'md5', 'registerYeepay', 'HongcaiUser', 'config', function ($rootScope, $scope, $state, $stateParams, md5, registerYeepay, HongcaiUser, config) {
    /*var userId = $stateParams.userId;
    if (!userId) {
      $state.go('root.main');
    }
    HongcaiUser.$find('checkSession').$then(function(response) {
      if (response.user) {
        // 用户在url上输入一个错误的userId
        if (userId != response.user.id ) {
          $state.go('root.main');
        } else if (response.securityStatus.realNameAuthStatus === 1) {
          // 该用户已经绑定
          $state.go('root.main');
        }
      } else {
        // 绑定超时
        $state.go('root.main');
      }
    });*/

    // 注册易宝POST
    $scope.signUpYeepay = function(user) {

      if (!user.realName || !user.idCardNo) {
        $scope.errMsg = '请输入姓名或身份证号';
      }
      $state.go('root.yeepay-transfer', {
        type: 'register',
        number: "null",
        realName: user.realName,
        idNo: user.idCardNo
      });
    };
    

  }]);
