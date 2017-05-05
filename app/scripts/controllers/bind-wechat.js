'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:BindWechatCtrl
 * @description
 * # BindWechatCtrl
 * Controller of the p2pSiteMobApp
 */

angular.module('p2pSiteMobApp')
  .controller('BindWechatCtrl', function($scope, $rootScope, checkPwdUtils) {
    //监测手机号码
    $scope.mobilePattern = /^((13[0-9])|(15[^4,\D])|(18[0-9])|(17[03678])|(14[0-9]))\d{8}$/;
    $scope.$watch('user.mobile', function(val) {
      if (val !== undefined) {
          var valLgth = val.toString().length;
          if (valLgth > 11 && !$scope.mobilePattern.test(val)) {
            $rootScope.showMsg('手机号码格式不正确');
          }
        }
    })
    //监控密码
    $scope.$watch('user.password', function(val) {
        checkPwdUtils.showPwd1(val);
    })
  });
