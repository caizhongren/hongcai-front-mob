/*
* @Author: yuyang
* @Date:   2016-09-28 16:15:10
* @Last Modified by:   yuyang
* @Last Modified time: 2017-04-06 16:12:25
*/

'use strict';
angular.module('p2pSiteMobApp')
  .controller('InviteSharingCtrl', function($scope, WEB_DEFAULT_DOMAIN) {
  	//图形验证码
    $scope.getPicCaptcha = WEB_DEFAULT_DOMAIN + '/siteUser/getPicCaptcha?';
    $scope.refreshCode = function() {
      angular.element('#checkCaptcha').attr('src', angular.element('#checkCaptcha').attr('src').substr(0, angular.element('#checkCaptcha').attr('src').indexOf('?')) + '?code=' + Math.random());
    };
    $scope.isSuccess = true;
    $scope.isSuccess ? $('.invite-sharing').addClass('position-fix')  : $('.invite-sharing').removeClass('position-fix'); 
    $scope.successMask = function() {
    	$scope.isSuccess = !$scope.isSuccess;
    	$scope.isSuccess ? $('.invite-sharing').addClass('position-fix')  : $('.invite-sharing').removeClass('position-fix'); 
    }
  })