'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('MessageCtrl', ['$scope', '$rootScope', 'HongcaiUser','Restangular', function ($scope, $rootScope, HongcaiUser, Restangular) {

  	$scope.page = 1;
  	$scope.notices = [];
    $rootScope.checkSession.promise.then(function(){
      if(!$rootScope.isLogged){
        $state.go('root.login');
      }

      
    });
    //查询网站公告
    $scope.getNotice = function(page){
    	Restangular.one('userMsgs/0/notices').get({
    		page: page,
    		pageSize: 15
    	}).then(function(response){
    		$scope.noticeTotalPage = response.totalPage;
    		$scope.noticePageSize = response.pageSize;
    		$scope.noticeTotal = response.total;
    		for (var i = 0; i < response.data.length; i++) {
          $scope.notices.push(response.data[i]);
        };
    	})
    }
    $scope.getNotice(1);

    //查看更多方法
    $scope.viewMore = function(func) {
    	$scope.page = $scope.page + 1;
    	func($scope.page);
    };

  }]);
