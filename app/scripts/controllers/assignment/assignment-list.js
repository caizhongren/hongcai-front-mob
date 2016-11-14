angular.module('p2pSiteMobApp')
  .controller('AssignmentListCtrl', function($scope, $rootScope, $state, $timeout, Restangular, ProjectUtils, ScreenWidthUtil){
  	$scope.page = 1;
  	$scope.getAssignmentList = function(page) {
  		Restangular.one("assignments").get({
  			page: page,
  			pageSize: 5
  		}).then(function(response){
  			if(response && response.ret !== -1) {
  				$scope.assignments =  response.assignments;
  				$scope.pageCount = response.pageCount;
  			}
  		})
  	}
  	$scope.getAssignmentList($scope.page, 6);
  	$scope.loadMore = function(page) {
  		if(page < $scope.pageCount) {
  			$scope.getAssignmentList(page + 1);
  		}
  	}
	  //限制项目名长度
		$scope.widthFlag = ScreenWidthUtil.screenWidth();
 })