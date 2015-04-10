'use strict';
/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the p2pSiteMobApp
+ */
angular.module('p2pSiteMobApp')
  .controller('MainCtrl',['$scope', 'restmod', 'User', 'HongcaiUser', function ($scope, restmod, User, HongcaiUser) {
    // 暂时注释掉
    // $scope.user = User.$find(1);
    // $scope.oneHongcaiUser = HongcaiUser.$find(402016);
    // var loginAuth = restmod.model('/ipa/hongcai/users/login');
    // var loginHongcaiAuth = restmod.model('/hongcai/rest/base/login');
    // $scope.login = function(user) {
    //   // 宏财用户
    //   // return loginHongcaiAuth.$create({account: user.account, password: user.password});
    //   // 微信用户登录
    //   return loginAuth.$create({account: user.account, password: user.password})
    // }

  }]);
