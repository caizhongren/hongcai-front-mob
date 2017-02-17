'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:MessageCtrl
 * @description
 * # MessageCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('MessageCtrl', ['$scope', '$rootScope', 'HongcaiUser', 'Restangular', function ($scope, $rootScope, HongcaiUser, Restangular) {
  	$scope.userMsgsList = [];
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
    		if(response && response.ret !== -1) {
    			$scope.readNotices();
					$scope.noticeTotalPage = response.totalPage;
					$scope.noticePageSize = response.pageSize;
					$scope.noticeTotal = response.total;
					for (var i = 0; i < response.data.length; i++) {
			      $scope.notices.push(response.data[i]);
			    };
    		}

    	})
    }
    $scope.getNotice(1);

    //查看更多方法
    $scope.viewMore = function(func) {
    	$scope.page = $scope.page + 1;
    	func($scope.page);
    };

    //查询是否有未读公告
    $scope.readNotices = function() {
	    Restangular.one('/userMsgs/' + '0' + '/unReadNotices' ).get().then(function(response){
	  		if (response && response.ret !== -1) {
	  			if(response.count > 0) {
	  				// 标记所有公告已读
	  				Restangular.one('/userMsgs/' + '0' + '/readAllNotices' ).put({}).then(function(response){})
	  			}
	  		}
	  	})
    }
    $scope.readMsgs = function() {
    	// 查询是否有未读的提醒
	    Restangular.one('/userMsgs/' + '0' + '/unReadMsgs' ).get().then(function(response){
	  		if (response && response.ret !== -1) {
	  			$scope.unReadMsgs = response.count;
	  		}
	  	})
    }
    $scope.readMsgs();
	
	// 提醒记录
    $scope.getUserMsgs = function(page) {
	  	Restangular.one('/userMsgs/' + '0' + '/userMsgs' ).get({
	  		page : page,
	  		pageSize : 15
	  	}).then(function(response){
	  		if (response && response.ret !== -1) {
	  			
	  			$scope.msgTotalPage = response.totalPage;
	  			$scope.msgTotal = response.total;
	  			for (var i = 0; i < response.data.length; i++) {
		          $scope.userMsgsList.push(response.data[i]);
		        };
	  		}
	  	})
    }
  		

  	$scope.toggleTab = function(activeTab){
  		$scope.activeTab = activeTab;
  		if (activeTab == 1) {
  			$scope.getUserMsgs();
  			Restangular.one('/userMsgs/' + '0' + '/readAllUserMsgs' ).put({}).then(function(response){})
  			$scope.readMsgs();
  		}
  	}

  }]);
