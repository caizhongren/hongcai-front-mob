'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:RegisterYeepayCtrl
 * @description
 * # RegisterCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('RegisterYeepayCtrl', function ($rootScope, $scope, $state, $stateParams, md5, registerYeepay, HongcaiUser, config, toCunGuanUtils) {
    var userId = $stateParams.userId;
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
    });

    // 注册易宝POST
    $scope.signUpYeepay = function(user) {

      if (!user || !user.realName || !user.idCardNo) {
        return;
      }
      toCunGuanUtils.to('register', null, user.realName, user.idCardNo, null, null);
    };
    

  });
