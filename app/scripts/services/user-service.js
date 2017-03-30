'use strict';

/**
 * 用户服务类
 */
angular.module('p2pSiteMobApp')
  .service('UserService', function (Restangular, DEFAULT_DOMAIN, SessionService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return {

    	loadUserAuth: function($scope){
    		$scope.userAuth = SessionService.getUserAuth();
	        if(!$scope.userAuth){
	          Restangular.one('users').one('0/userAuth').get().then(function(userAuth){
	            $scope.userAuth = userAuth;
	            SessionService.setUserAuthIfAuthed($scope.userAuth);
	          });
	        }
    	}	

    }


  });
