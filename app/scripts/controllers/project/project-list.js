'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:ProjectListCtrl
 * @description
 * # ProjectListCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('ProjectListCtrl', function($scope, $state, $rootScope, $stateParams, $location, Restangular, restmod, config,DateUtils){
  	$scope.page = 1;
    $scope.pageSize = 3;
    $scope.pageCount = 1;
  	$scope.widthFlag = "";
  	$scope.jigoubaoData = [];
  	
  	$scope.screenWidth = function(){
      $scope.width = document.body.scrollWidth; //用系统返回宽度除以分辨率
      if ($scope.width >= 320 && $scope.width < 375) {
        $scope.widthFlag = 0;
      } else if ($scope.width >= 375 && $scope.width < 414) {
        $scope.widthFlag = 1;
      } else if ($scope.width >= 414) {
        $scope.widthFlag = 2;
      }
      return $scope.widthFlag;
    }
    $scope.screenWidth();

    $scope.getTempData = function() {
      if ($scope.pageCount < $scope.page) {
        return;
      }
      Restangular.one('projects').get({
        page: $scope.page,
        pageSize: $scope.pageSize
      }).then(function(response) {
        $scope.jigoubao = response;
        $scope.baseFileUrl = response.baseFileUrl;
        // console.log(response);
        $scope.pageCount = response.pageCount;
        $scope.projectStatusMap = response.projectStatusMap;
        $scope.serverTime = response.serverTime || (new Date().getTime());
        for (var i = 0; i < response.projectList.length; i++) {
          response.projectList[i].countdown = new Date(response.projectList[i].releaseStartTime).getTime() - $scope.serverTime;
          response.projectList[i]._timeDown = DateUtils.toHourMinSeconds(response.projectList[i].countdown);
          $scope.jigoubaoData.push(response.projectList[i]);
        };

      });
    }
    $scope.getTempData();
    $scope.loadDealMuch = function() {
      $scope.DealBusy = true;
      $scope.getTempData();
      $scope.page = $scope.page + 1;
      $scope.pageCount = $scope.pageCount + 1;
      $scope.pageSize = $scope.pageSize;

      $scope.DealBusy = false;
    };
    
  })
  .run(function($rootScope, DEFAULT_DOMAIN, $q, $timeout, $state, $location, $http, $uibModal, ipCookie, restmod, config, Restangular, URLService, Utils) {
    Restangular.setBaseUrl('/hongcai/rest');
    Restangular.setDefaultHeaders({
      'Content-Type': 'application/json'
    })

    var routespermission = [
      '/user-center'
    ];

    var titleMap = {
      'issue': '常见问题',
      'about': '帮助中心',
      'safe': '安全保障',
      'account': '账户总览'
    };

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      var title = '宏财理财';
      if (toState.data && toState.data.title) {
        title = toState.data.title;
      }
      $rootScope.headerTitle = ' 宏金保';
    });  

    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      var title = '宏财理财';
      if (toState.data && toState.data.title) {
        title = toState.data.title;
      }
      $rootScope.headerTitle =  ' 宏金保 ';
    });
    
    // 微信等webview中无法修改title的问题
	//需要jQuery
	var $body = $('body');
	document.title = $rootScope.headerTitle;
	// hack在微信等webview中无法修改document.title的情况
	var $iframe = $('<iframe src="/favicon.ico" style="visibility:hidden"></iframe>');
	$iframe.on('load',function() {
	    setTimeout(function() {
	        $iframe.off('load').remove();
	    }, 0);
	}).appendTo($body);

	var path = $location.path().split('/')[1];
	  $rootScope.showPath = path;
	  $rootScope.showTitle = titleMap[path];

	  $rootScope.channelCode = $state.params.f;
	  $rootScope.act = $state.params.act;

	  if ($rootScope.channelCode){
	    ipCookie('utm_from', $rootScope.channelCode, {
	      expires: 1,
	      path: '/'
	    });
	  }

      if ($rootScope.act) {
        ipCookie('act', $rootScope.act, {
          expires: 1,
          path: '/'
        });
      }
   }); 