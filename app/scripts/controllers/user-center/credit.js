'use strict';

/**
 * @ngdoc function
 * @name p2pSiteMobApp.controller:CreditCtrl
 * @description
 * # CreditCtrl
 * Controller of the p2pSiteMobApp
 */
angular.module('p2pSiteMobApp')
  .controller('CreditCtrl', function($scope, $rootScope, $state, HongcaiUser, restmod, DEFAULT_DOMAIN) {

    // tab
    $scope.toggle = {};
    $scope.tabs = [{
      title: '持有中',
    }, {
      title: '已回款',
    }];

    $rootScope.selectedSide = 'investments-stat';
    $scope.page = 1;
    $scope.pageSize = 10;
    //$scope.creditsDetail = [];
    $scope.credits = [];

    $rootScope.checkSession.promise.then(function(){
      $scope.getCredits('1,2');
      HongcaiUser.$find($rootScope.hasLoggedUser.id + '/totalProfit').$then(function(response){
        if (response.ret !== -1) {
          $scope.totalProfit = response;
        }
      });
    });
    $scope.toggle.switchTab = function(tabIndex) {
      $scope.toggle.activeTab = tabIndex;
      console.log(tabIndex);
      if (tabIndex === 0) {
        $scope.creditStatus = '1,2';
      } else {
        $scope.creditStatus = '3';
      }
      $scope.credits = [];
      $scope.page = 1;
      $scope.getCredits($scope.creditStatus);
      //$scope.getCreditList($scope.creditStatus);
    };



    $scope.getCredits = function(status) {
        $scope.creditStatus = status;
        HongcaiUser.$find($rootScope.hasLoggedUser.id + '/credits', {
          status: $scope.creditStatus,
          page: $scope.page,
          pageSize: $scope.pageSize
        }).$then(function(response){
          $scope.totalPage = response.totalPage;
          var credits = response.data;
          for (var i = 0; i <= credits.length - 1; i++) {
            $scope.credits.push(credits[i]);
          };
        });
    };

    /**
     * 加载更多
     */
    $scope.loadCreditMore = function() {
      $scope.page = $scope.page + 1;
      $scope.getCredits($scope.creditStatus);
    };

    
  });
