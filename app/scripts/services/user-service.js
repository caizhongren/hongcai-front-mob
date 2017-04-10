'use strict';

/**
 * 用户服务类
 */
angular.module('p2pSiteMobApp')
  .service('UserService', function (Restangular, SessionService) {
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
    	},

      loadAccount: function($scope){
        $scope.account = sessionStorage.getItem('userAccount') ? angular.fromJson(sessionStorage.getItem('userAccount')) : undefined;
        Restangular.one('users').one('0/account').get().then(function(response){
          if(!response || response.ret == -1) { return;}
          $scope.account = response;
          sessionStorage.setItem('userAccount', angular.toJson($scope.account));
        });
      }	

    }


  });
