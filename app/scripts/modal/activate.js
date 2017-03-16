/*
 * @Author: Administrator
 * @Date:   2016-08-22 18:44:36
 * @Last Modified by:   fuqiang1
 * @Last Modified time: 2016-09-19 19:42:24
 */

'use strict';
angular.module('p2pSiteMobApp')
  .controller('ActivateCtrl', function($scope, $rootScope, $state, toCunGuanUtils) {
    $scope.showActivateTip = true;
    $scope.cancel = function() {
      $scope.showActivateTip = false;
    };

    /**
     * 立即迁移
     */

    $scope.toOpen = function(){
    	$scope.cancel();
    	if(!$rootScope.isLogged){
        	$state.go('root.login');
        	return;
      	}

      	if($rootScope.securityStatus.realNameAuthStatus === 1 && !$rootScope.securityStatus.userAuth.active){
          toCunGuanUtils.to('active', null, null, null, null, null);
      	} else if($rootScope.securityStatus.realNameAuthStatus == 0){
      		$rootScope.toRealNameAuth();
      	}

    }

  });
